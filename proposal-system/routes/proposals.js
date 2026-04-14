const express = require('express');
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer para upload de logo
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/uploads')),
  filename: (req, file, cb) => cb(null, 'logo' + path.extname(file.originalname))
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Apenas imagens são permitidas'));
  }
});

// Gera número de proposta automático
async function generateProposalNumber() {
  const year = new Date().getFullYear();
  const [rows] = await db.query(
    'SELECT COUNT(*) as total FROM proposals WHERE YEAR(created_at) = ?', [year]
  );
  const seq = String(rows[0].total + 1).padStart(3, '0');
  return `PROP-${year}-${seq}`;
}

// ─── DASHBOARD ───────────────────────────────────────────────
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const [proposals] = await db.query(
      `SELECT id, proposal_number, proposal_title, client_company, client_name,
              status, final_value, created_at, valid_until
       FROM proposals ORDER BY created_at DESC`
    );

    const [stats] = await db.query(`
      SELECT
        COUNT(*) as total,
        SUM(status = 'aprovada') as aprovadas,
        SUM(status = 'enviada') as enviadas,
        SUM(status = 'rascunho') as rascunhos,
        SUM(status = 'rejeitada') as rejeitadas,
        SUM(CASE WHEN status = 'aprovada' THEN final_value ELSE 0 END) as valor_aprovado
      FROM proposals
    `);

    res.render('dashboard', {
      user: req.user,
      proposals,
      stats: stats[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar dashboard');
  }
});

// ─── NOVA PROPOSTA ────────────────────────────────────────────
router.get('/proposals/new', requireAuth, async (req, res) => {
  const proposalNumber = await generateProposalNumber();
  const [company] = await db.query('SELECT * FROM company_settings WHERE id = 1');
  res.render('proposal-form', {
    user: req.user,
    proposal: null,
    proposalNumber,
    company: company[0] || {},
    action: '/proposals',
    method: 'POST'
  });
});

// ─── CRIAR PROPOSTA ───────────────────────────────────────────
router.post('/proposals', requireAuth, async (req, res) => {
  try {
    const data = sanitizeProposalData(req.body);
    const proposalNumber = await generateProposalNumber();

    await db.query(`
      INSERT INTO proposals (
        proposal_number, proposal_title, status, responsible, validity_days,
        proposal_date, valid_until,
        client_name, client_company, client_email, client_phone, client_cnpj,
        client_address, client_city, client_state, client_contact_name,
        project_description, project_objectives, project_scope, out_of_scope,
        technologies, architecture, integrations, requirements,
        deliverables, timeline,
        total_value, discount_value, final_value, payment_method, payment_conditions, installments,
        warranty_months, warranty_description, sla_response_time, support_description,
        general_conditions, internal_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      proposalNumber, data.proposal_title, data.status, data.responsible, data.validity_days,
      data.proposal_date, data.valid_until,
      data.client_name, data.client_company, data.client_email, data.client_phone, data.client_cnpj,
      data.client_address, data.client_city, data.client_state, data.client_contact_name,
      data.project_description, data.project_objectives, data.project_scope, data.out_of_scope,
      JSON.stringify(data.technologies || []), data.architecture, data.integrations, data.requirements,
      JSON.stringify(data.deliverables || []), JSON.stringify(data.timeline || []),
      data.total_value, data.discount_value, data.final_value, data.payment_method, data.payment_conditions, data.installments,
      data.warranty_months, data.warranty_description, data.sla_response_time, data.support_description,
      data.general_conditions, data.internal_notes
    ]);

    res.redirect('/dashboard?success=Proposta+criada+com+sucesso');
  } catch (err) {
    console.error('[Proposals] Erro ao criar:', err);
    res.status(500).send('Erro ao salvar proposta');
  }
});

// ─── EDITAR PROPOSTA ──────────────────────────────────────────
router.get('/proposals/:id/edit', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM proposals WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).send('Proposta não encontrada');

    const proposal = parseJsonFields(rows[0]);
    const [company] = await db.query('SELECT * FROM company_settings WHERE id = 1');

    res.render('proposal-form', {
      user: req.user,
      proposal,
      proposalNumber: proposal.proposal_number,
      company: company[0] || {},
      action: `/proposals/${proposal.id}`,
      method: 'PUT'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar proposta');
  }
});

// ─── ATUALIZAR PROPOSTA ───────────────────────────────────────
router.post('/proposals/:id', requireAuth, async (req, res) => {
  const { _method } = req.body;
  if (_method === 'PUT') {
    try {
      const data = sanitizeProposalData(req.body);

      await db.query(`
        UPDATE proposals SET
          proposal_title=?, status=?, responsible=?, validity_days=?,
          proposal_date=?, valid_until=?,
          client_name=?, client_company=?, client_email=?, client_phone=?, client_cnpj=?,
          client_address=?, client_city=?, client_state=?, client_contact_name=?,
          project_description=?, project_objectives=?, project_scope=?, out_of_scope=?,
          technologies=?, architecture=?, integrations=?, requirements=?,
          deliverables=?, timeline=?,
          total_value=?, discount_value=?, final_value=?, payment_method=?, payment_conditions=?, installments=?,
          warranty_months=?, warranty_description=?, sla_response_time=?, support_description=?,
          general_conditions=?, internal_notes=?,
          sent_at = CASE WHEN ? = 'enviada' AND sent_at IS NULL THEN NOW() ELSE sent_at END,
          approved_at = CASE WHEN ? = 'aprovada' AND approved_at IS NULL THEN NOW() ELSE approved_at END
        WHERE id=?
      `, [
        data.proposal_title, data.status, data.responsible, data.validity_days,
        data.proposal_date, data.valid_until,
        data.client_name, data.client_company, data.client_email, data.client_phone, data.client_cnpj,
        data.client_address, data.client_city, data.client_state, data.client_contact_name,
        data.project_description, data.project_objectives, data.project_scope, data.out_of_scope,
        JSON.stringify(data.technologies || []), data.architecture, data.integrations, data.requirements,
        JSON.stringify(data.deliverables || []), JSON.stringify(data.timeline || []),
        data.total_value, data.discount_value, data.final_value, data.payment_method, data.payment_conditions, data.installments,
        data.warranty_months, data.warranty_description, data.sla_response_time, data.support_description,
        data.general_conditions, data.internal_notes,
        data.status, data.status,
        req.params.id
      ]);

      res.redirect('/dashboard?success=Proposta+atualizada');
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao atualizar proposta');
    }
  } else if (_method === 'DELETE') {
    await db.query('DELETE FROM proposals WHERE id = ?', [req.params.id]);
    res.redirect('/dashboard?success=Proposta+excluída');
  }
});

// ─── VER PROPOSTA ─────────────────────────────────────────────
router.get('/proposals/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM proposals WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).send('Proposta não encontrada');

    const proposal = parseJsonFields(rows[0]);
    const [company] = await db.query('SELECT * FROM company_settings WHERE id = 1');

    res.render('proposal-view', {
      user: req.user,
      proposal,
      company: company[0] || {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar proposta');
  }
});

// ─── CONFIGURAÇÕES DA EMPRESA ─────────────────────────────────
router.get('/settings', requireAuth, async (req, res) => {
  const [company] = await db.query('SELECT * FROM company_settings WHERE id = 1');
  res.render('settings', { user: req.user, company: company[0] || {}, success: null, error: null });
});

router.post('/settings', requireAuth, upload.single('logo'), async (req, res) => {
  try {
    const d = req.body;
    let logo_path = d.existing_logo || '';
    if (req.file) logo_path = '/uploads/' + req.file.filename;

    await db.query(`
      UPDATE company_settings SET
        company_name=?, cnpj=?, address=?, city=?, state=?, zip=?, phone=?,
        email=?, website=?, logo_path=?,
        bank_name=?, bank_agency=?, bank_account=?, bank_pix=?, footer_text=?
      WHERE id=1
    `, [
      d.company_name, d.cnpj, d.address, d.city, d.state, d.zip, d.phone,
      d.email, d.website, logo_path,
      d.bank_name, d.bank_agency, d.bank_account, d.bank_pix, d.footer_text
    ]);

    const [company] = await db.query('SELECT * FROM company_settings WHERE id = 1');
    res.render('settings', { user: req.user, company: company[0], success: 'Dados salvos com sucesso!', error: null });
  } catch (err) {
    console.error(err);
    res.render('settings', { user: req.user, company: req.body, success: null, error: 'Erro ao salvar.' });
  }
});

// ─── HELPERS ──────────────────────────────────────────────────
function sanitizeProposalData(body) {
  // Processar tecnologias (campo com tags)
  let technologies = [];
  if (body.technologies_raw) {
    technologies = body.technologies_raw.split(',').map(t => t.trim()).filter(Boolean);
  }

  // Processar entregas
  let deliverables = [];
  if (body['deliverable_title[]']) {
    const titles = [].concat(body['deliverable_title[]'] || []);
    const descs = [].concat(body['deliverable_description[]'] || []);
    const deadlines = [].concat(body['deliverable_deadline[]'] || []);
    titles.forEach((title, i) => {
      if (title.trim()) deliverables.push({ title, description: descs[i] || '', deadline: deadlines[i] || '' });
    });
  }

  // Processar cronograma
  let timeline = [];
  if (body['timeline_phase[]']) {
    const phases = [].concat(body['timeline_phase[]'] || []);
    const durations = [].concat(body['timeline_duration[]'] || []);
    const descriptions = [].concat(body['timeline_description[]'] || []);
    phases.forEach((phase, i) => {
      if (phase.trim()) timeline.push({ phase, duration: durations[i] || '', description: descriptions[i] || '' });
    });
  }

  const totalValue = parseFloat(body.total_value?.replace(',', '.') || 0);
  const discountValue = parseFloat(body.discount_value?.replace(',', '.') || 0);
  const finalValue = totalValue - discountValue;

  const proposalDate = body.proposal_date || new Date().toISOString().split('T')[0];
  const validityDays = parseInt(body.validity_days) || 30;
  const validUntil = body.valid_until || (() => {
    const d = new Date(proposalDate);
    d.setDate(d.getDate() + validityDays);
    return d.toISOString().split('T')[0];
  })();

  return {
    proposal_title: body.proposal_title || '',
    status: body.status || 'rascunho',
    responsible: body.responsible || '',
    validity_days: validityDays,
    proposal_date: proposalDate,
    valid_until: validUntil,
    client_name: body.client_name || '',
    client_company: body.client_company || '',
    client_email: body.client_email || '',
    client_phone: body.client_phone || '',
    client_cnpj: body.client_cnpj || '',
    client_address: body.client_address || '',
    client_city: body.client_city || '',
    client_state: body.client_state || '',
    client_contact_name: body.client_contact_name || '',
    project_description: body.project_description || '',
    project_objectives: body.project_objectives || '',
    project_scope: body.project_scope || '',
    out_of_scope: body.out_of_scope || '',
    technologies,
    architecture: body.architecture || '',
    integrations: body.integrations || '',
    requirements: body.requirements || '',
    deliverables,
    timeline,
    total_value: totalValue,
    discount_value: discountValue,
    final_value: finalValue,
    payment_method: body.payment_method || '',
    payment_conditions: body.payment_conditions || '',
    installments: parseInt(body.installments) || 1,
    warranty_months: parseInt(body.warranty_months) || 3,
    warranty_description: body.warranty_description || '',
    sla_response_time: body.sla_response_time || '',
    support_description: body.support_description || '',
    general_conditions: body.general_conditions || '',
    internal_notes: body.internal_notes || ''
  };
}

function parseJsonFields(proposal) {
  try { proposal.technologies = JSON.parse(proposal.technologies || '[]'); } catch { proposal.technologies = []; }
  try { proposal.deliverables = JSON.parse(proposal.deliverables || '[]'); } catch { proposal.deliverables = []; }
  try { proposal.timeline = JSON.parse(proposal.timeline || '[]'); } catch { proposal.timeline = []; }
  return proposal;
}

module.exports = router;
