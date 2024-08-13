let inventario = [];
let categorias = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    mostrarInventario();
});

function cargarDatos() {
    inventario = JSON.parse(localStorage.getItem('inventario')) || [];
    categorias = JSON.parse(localStorage.getItem('categorias')) || [];
}

function mostrarInventario() {
    const inventarioContainer = document.getElementById('inventario-container');
    inventarioContainer.innerHTML = '';
    const inventarioPorCategoria = agruparPorCategoria(inventario);

    categorias.forEach(categoria => {
        const elementosCategoria = inventarioPorCategoria[categoria] || [];
        if (elementosCategoria.length > 0) {
            const categoriaContainer = document.createElement('div');
            categoriaContainer.classList.add('categoria-container');
            categoriaContainer.dataset.categoria = categoria;
            categoriaContainer.innerHTML = `
                <div class="categoria-header">
                    <h2>${categoria}</h2>
                    <button class="btn-mini btn-eliminar" onclick="eliminarCategoria('${categoria}', this)">×</button>
                </div>
                <div class="inventario-grid">
                    ${elementosCategoria.map(elemento => `
                        <div class="inventario-item" data-id="${elemento.id}">
                            <h3>${elemento.nombre}</h3>
                            <p>Cantidad: ${elemento.cantidad}</p>
                            <p>Fecha: ${elemento.fecha} ${elemento.hora}</p>
                            <button class="btn-mini btn-eliminar" onclick="eliminarElemento(${elemento.id}, this)">×</button>
                        </div>
                    `).join('')}
                </div>
            `;
            inventarioContainer.appendChild(categoriaContainer);
        }
    });

    // Elementos sin categoría
    const elementosSinCategoria = inventarioPorCategoria[''] || [];
    if (elementosSinCategoria.length > 0) {
        const sinCategoriaContainer = document.createElement('div');
        sinCategoriaContainer.classList.add('categoria-container');
        sinCategoriaContainer.dataset.categoria = '';
        sinCategoriaContainer.innerHTML = `
            <div class="categoria-header">
                <h2>Sin categoría</h2>
            </div>
            <div class="inventario-grid">
                ${elementosSinCategoria.map(elemento => `
                    <div class="inventario-item" data-id="${elemento.id}">
                        <h3>${elemento.nombre}</h3>
                        <p>Cantidad: ${elemento.cantidad}</p>
                        <p>Fecha: ${elemento.fecha} ${elemento.hora}</p>
                        <button class="btn-mini btn-eliminar" onclick="eliminarElemento(${elemento.id}, this)">×</button>
                    </div>
                `).join('')}
            </div>
        `;
        inventarioContainer.appendChild(sinCategoriaContainer);
    }
}

function agruparPorCategoria(inventario) {
    return inventario.reduce((acc, elemento) => {
        const categoria = elemento.categoria || '';
        if (!acc[categoria]) {
            acc[categoria] = [];
        }
        acc[categoria].push(elemento);
        return acc;
    }, {});
}

function eliminarElemento(id, boton) {
    const elementoItem = boton.closest('.inventario-item');
    elementoItem.style.transition = 'opacity 0.3s ease-out';
    elementoItem.style.opacity = '0';

    setTimeout(() => {
        elementoItem.remove();
        inventario = inventario.filter(elemento => elemento.id !== id);
        localStorage.setItem('inventario', JSON.stringify(inventario));
        
        const categoriaContainer = boton.closest('.categoria-container');
        if (categoriaContainer.querySelectorAll('.inventario-item').length === 0) {
            categoriaContainer.remove();
        }
    }, 300);
}

function eliminarCategoria(categoria, boton) {
    const categoriaContainer = boton.closest('.categoria-container');
    categoriaContainer.style.transition = 'opacity 0.3s ease-out';
    categoriaContainer.style.opacity = '0';

    setTimeout(() => {
        categoriaContainer.remove();
        categorias = categorias.filter(c => c !== categoria);
        localStorage.setItem('categorias', JSON.stringify(categorias));

        inventario = inventario.map(elemento => {
            if (elemento.categoria === categoria) {
                elemento.categoria = '';
            }
            return elemento;
        });
        localStorage.setItem('inventario', JSON.stringify(inventario));
    }, 300);
}