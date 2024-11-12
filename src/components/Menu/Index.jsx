import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './Menu.module.css';
import { GlobalContext } from '../../context/GlobalContext';




function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const { cerrarSesion } = useContext(GlobalContext);

    const salir = () => {
        cerrarSesion();
    };

    return (
        <div className={styles.menuContainer}>
            <button
                className={styles.botonMenu}
                onClick={() => setIsOpen(!isOpen)}
            >
                MENU
            </button>
            {isOpen && (
                <div className={styles.menu}>
                    <Link to="/" className={styles.menuItem}>Inicio</Link>
                    <Link to="/MenuCompras" className={styles.menuItem}>Menu Compras</Link>
                    <Link to="/CarritoCompras" className={styles.menuItem}>Carrito</Link>
                    <Link to="/Historial" className={styles.menuItem}>Historial</Link>
                    <button onClick={salir} className={styles.menuItemBoton}>Salir</button>
                </div>
            )}
        </div>
    );
}

export default Menu;