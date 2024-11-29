import { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";
import db from "../../db/db";
import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import styles from "./IngresoQr.module.css";
import iconoscan from "/Icons/scan.svg";

function IngresoQr() {
    const { setPopUpConfirm, setPopUp, limpiarPopUp } = useContext(GlobalContext);
    const [scanning, setScanning] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (scanning) {
            Quagga.init(
                {
                    inputStream: {
                        type: "LiveStream",
                        target: videoRef.current,
                        constraints: {
                            facingMode: "environment", // Usar cámara trasera
                        },
                    },
                    decoder: {
                        readers: ["ean_reader", "code_128_reader"], // Lectores de códigos estándar
                    },
                },
                (err) => {
                    if (err) {
                        console.error("Error al inicializar Quagga:", err);
                        setScanning(false);
                        return;
                    }
                    Quagga.start();
                }
            );

            // Manejar detección
            Quagga.onDetected(async (data) => {
                const codigo = data.codeResult.code;
                

                if (codigo) {
                    // Buscar producto en IndexedDB
                    const producto = await db.articulos.where("codbar").equals(codigo).first();
                    if (producto) {
                        // Convertir blob a URL si existe
                        const imagenUrl = producto.imagen_blob
                            ? URL.createObjectURL(producto.imagen_blob)
                            : "";

                        setPopUpConfirm({
                            show: true,
                            from: "AGRP",
                            urlImagen: imagenUrl,
                            nombre: producto.nombre_art,
                            descripcion: producto.descripcion_art,
                            valor: producto.valor_unit,
                        });

                        // Liberar memoria cuando la URL ya no sea necesaria
                        if (imagenUrl) {
                            setTimeout(() => {
                                URL.revokeObjectURL(imagenUrl);
                            }, 5000); // Revoke después de un tiempo
                        }
                    } else {
                        setPopUp({
                            show: true,
                            type: "error",
                            message: "Producto no encontrado",
                            zeIndex: "98",
                            from: "MSJ",
                            duration: "3s",
                        });
                        setTimeout(() => {
                            limpiarPopUp();
                        }, 3000);
                    }
                    Quagga.stop();
                    setScanning(false);
                }
            });

            Quagga.onProcessed((result) => {
                if (result && videoRef.current) {
                    const drawingCtx = Quagga.canvas.ctx.overlay;
                    const drawingCanvas = Quagga.canvas.dom.overlay;

                    if (result.boxes) {
                        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                        result.boxes
                            .filter((box) => box !== result.box)
                            .forEach((box) =>
                                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                                    color: "green",
                                    lineWidth: 2,
                                })
                            );
                    }
                }
            });
        }

        return () => {
            if (scanning) {
                Quagga.stop();
            }
        };
    }, [scanning, setPopUp, setPopUpConfirm]);

    return (
        <section className={styles.contenedor}>
            <div ref={videoRef} className={styles.videoContainer}></div>
            <div className={styles.botton}>
                <button
                    className={`${styles.boton} ${scanning ? styles.scanning : ""}`}
                    mane="Escanear"
                    type="Button"
                    onClick={() => setScanning((prev) => !prev)}
                >
                    <img src={iconoscan} alt="" />
                </button>
            </div>
        </section>
    );
}

export default IngresoQr;
