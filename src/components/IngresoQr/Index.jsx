import styles from "./IngresoQr.module.css";
import { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";
import db from "../../db/db";
import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
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

            Quagga.onDetected(async (data) => {
                const codigo = data.codeResult.code;
                if (codigo) {
                    const producto = await db.articulos.where("codbar").equals(codigo).first();
                    if (producto) {
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

                        if (imagenUrl) {
                            setTimeout(() => {
                                URL.revokeObjectURL(imagenUrl);
                            }, 5000);
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
                        setTimeout(() => limpiarPopUp(), 3000);
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
            // Limpia el contenido del video y el canvas
            if (videoRef.current) {
                const videoElement = videoRef.current.querySelector("video");
                if (videoElement) {
                    videoElement.srcObject = null;
                }
            }
            const drawingCtx = Quagga.canvas?.ctx?.overlay;
            const drawingCanvas = Quagga.canvas?.dom?.overlay;
            if (drawingCtx && drawingCanvas) {
                drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            }
        };
    }, [scanning, setPopUp, setPopUpConfirm]);

    return (
        <section className={styles.contenedor}>
            <div
                ref={videoRef}
                className={`${styles.videoContainer} ${scanning ? styles.videoContainerSScanning : ""}`}
            ></div>
            <div className={styles.botton}>
                <button
                    className={`${styles.boton} ${scanning ? styles.scanning : ""}`}
                    type="button"
                    onClick={() => setScanning((prev) => !prev)}
                >
                    <img src={iconoscan} alt="Escanear" />
                </button>
            </div>
        </section>
    );
}

export default IngresoQr;
