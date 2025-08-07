document.addEventListener('DOMContentLoaded', () => {
  const editBtn = document.getElementById('editBtn');
  const saveBtn = document.getElementById('saveBtn');

  editBtn.addEventListener('click', () => {
    const fields = document.querySelectorAll('[data-editable]');
    fields.forEach(field => {
      const value = field.innerText;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = value;
      input.className = 'text-sm text-gray-700 border border-gray-300 rounded px-2 py-1 w-full';
      field.replaceWith(input);
      input.setAttribute('data-editable', '');
    });

    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
  });

  saveBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('input[data-editable]');
    inputs.forEach(input => {
      const value = input.value;
      const p = document.createElement('p');
      p.innerText = value;
      p.className = 'text-sm text-gray-500';
      p.setAttribute('data-editable', '');
      input.replaceWith(p);
    });

    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
  });
});
