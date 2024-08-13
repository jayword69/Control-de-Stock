document.addEventListener('DOMContentLoaded', () => {
    const formProducto = document.getElementById('form-producto');
    const listaElementos = document.getElementById('elementos');
    const btnVerInventario = document.getElementById('ver-inventario');
    const selectCategoria = document.getElementById('categoria');
    const inputNuevaCategoria = document.getElementById('nueva-categoria');
    const btnCrearCategoria = document.getElementById('crear-categoria');

    let inventario = JSON.parse(localStorage.getItem('inventario')) || [];
    let categorias = JSON.parse(localStorage.getItem('categorias')) || [];

    function actualizarCategorias() {
        selectCategoria.innerHTML = '<option value="">Seleccionar categoría</option>';
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            selectCategoria.appendChild(option);
        });
    }

    actualizarCategorias();

    btnCrearCategoria.addEventListener('click', () => {
        const nuevaCategoria = inputNuevaCategoria.value.trim();
        if (nuevaCategoria && !categorias.includes(nuevaCategoria)) {
            categorias.push(nuevaCategoria);
            localStorage.setItem('categorias', JSON.stringify(categorias));
            actualizarCategorias();
            inputNuevaCategoria.value = '';
        }
    });

    formProducto.addEventListener('submit', (e) => {
        e.preventDefault();
        const ahora = new Date();
        const elemento = {
            id: Date.now(),
            nombre: document.getElementById('nombre').value,
            cantidad: document.getElementById('cantidad').value,
            categoria: selectCategoria.value,
            fecha: ahora.toLocaleDateString(),
            hora: ahora.toLocaleTimeString()
        };
        inventario.unshift(elemento);
        localStorage.setItem('inventario', JSON.stringify(inventario));
        agregarElemento(elemento);
        formProducto.reset();
        document.getElementById('nombre').focus();
    });

    function agregarElemento(elemento) {
        const card = document.createElement('div');
        card.classList.add('elemento-card');
        card.innerHTML = `<h3>${elemento.nombre}</h3>`;
        listaElementos.insertBefore(card, listaElementos.firstChild);
    }

    function cargarElementos() {
        listaElementos.innerHTML = '';
        inventario.forEach(elemento => agregarElemento(elemento));
    }

    cargarElementos();

    btnVerInventario.addEventListener('click', () => {
        window.location.href = 'inventario.html';
    });
});