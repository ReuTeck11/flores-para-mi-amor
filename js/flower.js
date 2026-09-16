/*
 * ============================================================
 * PROYECTO: FLORES PARA MI AMOR
 * ARCHIVO: flower.js
 * ============================================================
 *
 * Este archivo contiene la construcción visual de nuestra flor.
 *
 * La flor no será un simple objeto 3D.
 * Estará formada por diferentes partes:
 *
 * 🌻 Pétalos
 * 🟤 Centro de la flor
 * 🌱 Tallo
 * 🍃 Hojas
 * ✨ Halo de luz
 *
 * Todas estas partes estarán agrupadas dentro de un
 * THREE.Group para poder tratar la flor completa como
 * un único objeto.
 *
 * Además, guardaremos algunas partes importantes dentro
 * del propio grupo para que posteriormente podamos
 * animarlas desde main.js.
 * ============================================================
 */

import * as THREE from "three";


/* ============================================================
   FUNCIÓN PRINCIPAL: CREAR FLOR
   ============================================================ */

/**
 * Crea una flor amarilla completa en 3D.
 *
 * La función construye cada una de las partes de la flor
 * y finalmente las agrupa dentro de un THREE.Group.
 *
 * @returns {THREE.Group}
 * Grupo que representa nuestra flor completa.
 */
export function createFlower() {

    /*
     * --------------------------------------------------------
     * GRUPO PRINCIPAL
     * --------------------------------------------------------
     *
     * Aquí guardaremos absolutamente todas las partes
     * de nuestra flor.
     */
    const flower = new THREE.Group();


    /* ========================================================
       Tallo
       ======================================================== */

    /*
     * El tallo está ligeramente inclinado para que la flor
     * no tenga una apariencia completamente artificial.
     */
    const stemGeometry =
        new THREE.CylinderGeometry(
            0.045,
            0.065,
            1.65,
            16
        );

    const stemMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x315c32,
            roughness: 0.85
        });

    const stem =
        new THREE.Mesh(
            stemGeometry,
            stemMaterial
        );

    /*
     * Colocamos el tallo de manera que nazca desde el suelo.
     */
    stem.position.y = 0.82;

    /*
     * Una pequeña inclinación hace que la flor se vea
     * un poco más orgánica.
     */
    stem.rotation.z = -0.035;

    flower.add(stem);


    /* ========================================================
       HOJAS
       ======================================================== */

    /*
     * Las hojas utilizarán una esfera escalada.
     *
     * Es una técnica sencilla pero efectiva para crear
     * formas orgánicas sin utilizar modelos externos.
     */

    const leafGeometry =
        new THREE.SphereGeometry(
            0.32,
            16,
            10
        );

    const leafMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x356b38,
            roughness: 0.8
        });


    /* --------------------------------------------------------
       Hoja izquierda
       -------------------------------------------------------- */

    const leftLeaf =
        new THREE.Mesh(
            leafGeometry,
            leafMaterial
        );

    leftLeaf.scale.set(
        1.45,
        0.35,
        0.55
    );

    leftLeaf.position.set(
        -0.22,
        0.72,
        0
    );

    leftLeaf.rotation.z =
        -0.35;

    leftLeaf.rotation.y =
        -0.25;

    flower.add(leftLeaf);


    /* --------------------------------------------------------
       Hoja derecha
       -------------------------------------------------------- */

    const rightLeaf =
        new THREE.Mesh(
            leafGeometry,
            leafMaterial
        );

    rightLeaf.scale.set(
        1.45,
        0.35,
        0.55
    );

    rightLeaf.position.set(
        0.24,
        0.95,
        0
    );

    rightLeaf.rotation.z =
        0.35;

    rightLeaf.rotation.y =
        0.25;

    flower.add(rightLeaf);


    /* ========================================================
       CENTRO DE LA FLOR
       ======================================================== */

    /*
     * El centro será un poco más elaborado que la versión
     * anterior.
     *
     * Utilizamos una esfera achatada para crear la base.
     */

    const centerGeometry =
        new THREE.SphereGeometry(
            0.27,
            24,
            16
        );

    const centerMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x6b4218,
            roughness: 0.75
        });

    const center =
        new THREE.Mesh(
            centerGeometry,
            centerMaterial
        );

    center.scale.set(
        1,
        0.65,
        1
    );

    center.position.y =
        1.55;

    flower.add(center);


    /* ========================================================
       PEQUEÑOS DETALLES DEL CENTRO
       ======================================================== */

    /*
     * Para darle más profundidad al centro agregaremos
     * pequeños puntos alrededor de él.
     *
     * Esto simula las pequeñas semillas que podemos observar
     * en una flor de girasol.
     */

    const seedGeometry =
        new THREE.SphereGeometry(
            0.025,
            8,
            8
        );

    const seedMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x2f1b0b,
            roughness: 0.9
        });

    const seedCount = 45;

    for (
        let i = 0;
        i < seedCount;
        i++
    ) {

        /*
         * Distribución en espiral.
         *
         * El patrón de espiral ayuda a que el centro
         * no parezca simplemente una esfera.
         */
        const angle =
            i * 2.39996;

        const radius =
            Math.sqrt(i / seedCount) * 0.20;

        const seed =
            new THREE.Mesh(
                seedGeometry,
                seedMaterial
            );

        seed.position.x =
            Math.cos(angle) * radius;

        seed.position.z =
            Math.sin(angle) * radius;

        seed.position.y =
            1.56;

        flower.add(seed);
    }


    /* ========================================================
       PÉTALOS
       ======================================================== */

    /*
     * Una flor más bonita necesita más pétalos.
     *
     * Utilizaremos dos capas:
     *
     * 🌻 Primera capa: pétalos grandes.
     * 🌻 Segunda capa: pétalos ligeramente más pequeños.
     *
     * Esto crea una apariencia más llena.
     */

    const outerPetalCount = 20;

    const outerPetalGeometry =
        new THREE.SphereGeometry(
            0.30,
            18,
            12
        );


    /* --------------------------------------------------------
       Colores de los pétalos
       -------------------------------------------------------- */

    const petalColors = [
        0xffd83d,
        0xffdf55,
        0xffc928,
        0xffe36b
    ];


    /* --------------------------------------------------------
       Primera capa de pétalos
       -------------------------------------------------------- */

    for (
        let i = 0;
        i < outerPetalCount;
        i++
    ) {

        const angle =
            (i / outerPetalCount) *
            Math.PI *
            2;

        /*
         * Elegimos diferentes amarillos.
         *
         * De esta manera la flor no parece estar hecha
         * completamente con un único material.
         */
        const color =
            petalColors[
                i % petalColors.length
            ];

        const petalMaterial =
            new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.55,
                metalness: 0.05
            });

        const petal =
            new THREE.Mesh(
                outerPetalGeometry,
                petalMaterial
            );

        /*
         * Alargamos el pétalo.
         */
        petal.scale.set(
            0.55,
            1.25,
            0.18
        );

        /*
         * Distancia respecto al centro.
         */
        const radius =
            0.39;

        petal.position.x =
            Math.cos(angle) *
            radius;

        petal.position.z =
            Math.sin(angle) *
            radius;

        petal.position.y =
            1.55;

        /*
         * Orientamos el pétalo hacia afuera.
         */
        petal.rotation.y =
            -angle;

        /*
         * Una pequeña inclinación hace que los pétalos
         * no formen un círculo completamente plano.
         */
        petal.rotation.x =
            0.12;

        flower.add(petal);
    }


    /* --------------------------------------------------------
       Segunda capa de pétalos
       -------------------------------------------------------- */

    const innerPetalCount = 16;

    const innerPetalGeometry =
        new THREE.SphereGeometry(
            0.24,
            16,
            10
        );

    const innerPetalMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffd447,
            roughness: 0.58
        });


    for (
        let i = 0;
        i < innerPetalCount;
        i++
    ) {

        const angle =
            (i / innerPetalCount) *
            Math.PI *
            2;

        const petal =
            new THREE.Mesh(
                innerPetalGeometry,
                innerPetalMaterial
            );

        petal.scale.set(
            0.48,
            1.05,
            0.15
        );

        const radius =
            0.27;

        petal.position.x =
            Math.cos(angle) *
            radius;

        petal.position.z =
            Math.sin(angle) *
            radius;

        petal.position.y =
            1.56;

        petal.rotation.y =
            -angle;

        petal.rotation.x =
            0.08;

        flower.add(petal);
    }


    /* ========================================================
       HALO DORADO
       ======================================================== */

    /*
     * Esta esfera no será visible como una esfera sólida.
     *
     * Utilizamos un material transparente para crear una
     * pequeña sensación de luz alrededor de la flor.
     */

    const glowGeometry =
        new THREE.SphereGeometry(
            0.75,
            24,
            24
        );

    const glowMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffd75a,
            transparent: true,
            opacity: 0.035,
            depthWrite: false
        });

    const glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );

    glow.position.y =
        1.55;

    flower.add(glow);


    /* ========================================================
       LUZ PROPIA DE LA FLOR
       ======================================================== */

    /*
     * Añadimos una luz muy suave.
     *
     * Esto permitirá que la flor tenga un pequeño brillo
     * propio incluso cuando la escena esté oscura.
     *
     * Más adelante podremos aumentar esta intensidad
     * cuando el jugador toque la flor.
     */

    const flowerLight =
        new THREE.PointLight(
            0xffd45a,
            0.35,
            3
        );

    flowerLight.position.y =
        1.55;

    flower.add(
        flowerLight
    );


    /* ========================================================
       INFORMACIÓN PARA FUTURAS ANIMACIONES
       ======================================================== */

    /*
     * Guardamos referencias importantes dentro del grupo.
     *
     * Esto nos permitirá acceder posteriormente desde
     * main.js sin tener que buscar nuevamente cada objeto.
     *
     * Por ejemplo:
     *
     * mainFlower.userData.glow
     *
     * nos dará acceso al halo de la flor.
     */

    flower.userData = {

        /*
         * Centro de la flor.
         */
        center: center,

        /*
         * Halo luminoso.
         */
        glow: glow,

        /*
         * Luz propia.
         */
        light: flowerLight,

        /*
         * Hojas.
         */
        leftLeaf: leftLeaf,
        rightLeaf: rightLeaf,

        /*
         * Valor utilizado posteriormente para crear
         * un movimiento suave de respiración.
         */
        animationOffset:
            Math.random() * Math.PI * 2
    };


    /* ========================================================
       POSICIÓN INICIAL
       ======================================================== */

    /*
     * La flor comienza apoyada en el suelo.
     */
    flower.position.y = 0;


    /* ========================================================
       RESULTADO
       ======================================================== */

    return flower;
}