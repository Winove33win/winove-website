// Auto-dismiss alerts after 5s
document.querySelectorAll('.alert-dismissible').forEach(el => {
  setTimeout(() => {
    const bs = bootstrap.Alert.getOrCreateInstance(el);
    if (bs) bs.close();
  }, 5000);
});

// CNPJ mask
document.querySelectorAll('[data-mask="cnpj"]').forEach(input => {
  input.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 14);
    v = v.replace(/^(\d{2})(\d)/, '$1.$2');
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
    e.target.value = v;
  });
});
