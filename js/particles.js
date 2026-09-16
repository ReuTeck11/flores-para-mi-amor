/*
 * ============================================================
 * PROYECTO: FLORES PARA MI AMOR
 * ARCHIVO: particles.js
 * ============================================================
 *
 * Sistema encargado de crear y controlar las partículas
 * mágicas de nuestra experiencia.
 *
 * Las partículas pueden:
 *
 * 🌑 Permanecer ocultas.
 * ✨ Aparecer.
 * 💫 Flotar.
 * 🌟 Dispersarse.
 * 🌫️ Desvanecerse.
 *
 * Este sistema será reutilizable en diferentes escenas.
 * ============================================================
 */

import * as THREE from "three";


/* ============================================================
   CREAR PARTÍCULAS
   ============================================================ */

/**
 * Crea un sistema de partículas.
 *
 * @param {number} count
 * Cantidad de partículas.
 *
 * @returns {THREE.Points}
 */
export function createParticles(
    count = 120
) {

    const geometry =
        new THREE.BufferGeometry();


    /*
     * Posiciones de las partículas.
     */
    const positions =
        new Float32Array(
            count * 3
        );


    /*
     * Velocidades individuales.
     */
    const velocities =
        new Float32Array(
            count * 3
        );


    /* --------------------------------------------------------
       POSICIONES INICIALES
       -------------------------------------------------------- */

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const index =
            i * 3;


        /*
         * Distribuimos las partículas alrededor
         * de la posición central.
         */
        const angle =
            Math.random() *
            Math.PI *
            2;

        const radius =
            0.5 +
            Math.random() * 1.8;


        positions[index] =
            Math.cos(angle) *
            radius;

        positions[index + 1] =
            0.4 +
            Math.random() * 2.3;

        positions[index + 2] =
            Math.sin(angle) *
            radius;


        /*
         * Velocidades iniciales.
         */
        velocities[index] = 0;

        velocities[index + 1] =
            0.002 +
            Math.random() * 0.004;

        velocities[index + 2] = 0;
    }


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    /* ========================================================
       MATERIAL
       ======================================================== */

    const material =
        new THREE.PointsMaterial({

            color: 0xffd75a,

            size: 0.045,

            transparent: true,

            /*
             * Comienzan invisibles.
             */
            opacity: 0,

            depthWrite: false
        });


    /* ========================================================
       CREAR SISTEMA
       ======================================================== */

    const particles =
        new THREE.Points(
            geometry,
            material
        );


    /* ========================================================
       DATOS INTERNOS
       ======================================================== */

    particles.userData = {

        count: count,

        state: "HIDDEN",

        time: 0,

        burstPower: 0,

        velocities: velocities
    };


    return particles;
}


/* ============================================================
   MOSTRAR PARTÍCULAS
   ============================================================ */

/**
 * Hace aparecer progresivamente las partículas.
 */
export function showParticles(
    particles
) {

    if (!particles) {
        return;
    }


    particles.userData.state =
        "APPEARING";

    particles.userData.time =
        0;
}


/* ============================================================
   EXPLOSIÓN SUAVE
   ============================================================ */

/**
 * Dispersa las partículas alrededor de la flor.
 */
export function burstParticles(
    particles
) {

    if (!particles) {
        return;
    }


    particles.userData.state =
        "BURST";

    particles.userData.time =
        0;


    const velocities =
        particles.userData.velocities;


    const count =
        particles.userData.count;


    /*
     * Cada partícula recibe una dirección diferente.
     */
    for (
        let i = 0;
        i < count;
        i++
    ) {

        const index =
            i * 3;


        const directionX =
            Math.random() - 0.5;

        const directionY =
            0.25 +
            Math.random() * 0.8;

        const directionZ =
            Math.random() - 0.5;


        velocities[index] =
            directionX * 0.025;

        velocities[index + 1] =
            directionY * 0.025;

        velocities[index + 2] =
            directionZ * 0.025;
    }
}


/* ============================================================
   DESVANECER
   ============================================================ */

/**
 * Hace que las partículas desaparezcan lentamente.
 */
export function fadeParticles(
    particles
) {

    if (!particles) {
        return;
    }


    particles.userData.state =
        "FADING";

    particles.userData.time =
        0;
}


/* ============================================================
   REINICIAR
   ============================================================ */

/**
 * Devuelve las partículas a su estado inicial.
 *
 * Esto será útil cuando creemos nuevos efectos para
 * diferentes escenas.
 */
export function resetParticles(
    particles
) {

    if (!particles) {
        return;
    }


    const positionAttribute =
        particles.geometry.getAttribute(
            "position"
        );


    const count =
        particles.userData.count;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const index =
            i * 3;


        const angle =
            Math.random() *
            Math.PI *
            2;

        const radius =
            0.5 +
            Math.random() * 1.8;


        positionAttribute.array[
            index
        ] =
            Math.cos(angle) *
            radius;


        positionAttribute.array[
            index + 1
        ] =
            0.4 +
            Math.random() * 2.3;


        positionAttribute.array[
            index + 2
        ] =
            Math.sin(angle) *
            radius;
    }


    positionAttribute.needsUpdate =
        true;


    particles.material.opacity =
        0;


    particles.userData.state =
        "HIDDEN";

    particles.userData.time =
        0;
}


/* ============================================================
   ANIMAR
   ============================================================ */

/**
 * Actualiza las partículas.
 *
 * @param {THREE.Points} particles
 * Sistema de partículas.
 *
 * @param {number} elapsedTime
 * Tiempo total de la experiencia.
 *
 * @param {number} deltaTime
 * Tiempo desde el último frame.
 */
export function animateParticles(
    particles,
    elapsedTime,
    deltaTime
) {

    if (!particles) {
        return;
    }


    const state =
        particles.userData.state;


    const material =
        particles.material;


    const positionAttribute =
        particles.geometry.getAttribute(
            "position"
        );


    const count =
        particles.userData.count;


    /* ========================================================
       OCULTAS
       ======================================================== */

    if (
        state === "HIDDEN"
    ) {

        material.opacity = 0;

        return;
    }


    /* ========================================================
       APARECIENDO
       ======================================================== */

    if (
        state === "APPEARING"
    ) {

        particles.userData.time +=
            deltaTime;


        material.opacity =
            Math.min(
                particles.userData.time *
                0.6,
                0.65
            );


        if (
            material.opacity >= 0.65
        ) {

            particles.userData.state =
                "ACTIVE";
        }
    }


    /* ========================================================
       MOVIMIENTO NORMAL
       ======================================================== */

    if (
        state === "ACTIVE"
    ) {

        material.opacity =
            0.65;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const index =
                i * 3;


            /*
             * Las partículas suben lentamente.
             */
            positionAttribute.array[
                index + 1
            ] +=
                0.0015;


            /*
             * Movimiento horizontal.
             */
            positionAttribute.array[
                index
            ] +=
                Math.sin(
                    elapsedTime * 0.5 +
                    i
                ) *
                0.0004;


            /*
             * Movimiento en profundidad.
             */
            positionAttribute.array[
                index + 2
            ] +=
                Math.cos(
                    elapsedTime * 0.4 +
                    i
                ) *
                0.0003;


            /*
             * Reinicio vertical.
             */
            if (
                positionAttribute.array[
                    index + 1
                ] > 3
            ) {

                positionAttribute.array[
                    index + 1
                ] = 0;
            }
        }
    }


    /* ========================================================
       DISPERSIÓN
       ======================================================== */

    if (
        state === "BURST"
    ) {

        particles.userData.time +=
            deltaTime;


        const velocities =
            particles.userData.velocities;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const index =
                i * 3;


            positionAttribute.array[
                index
            ] +=
                velocities[index];

            positionAttribute.array[
                index + 1
            ] +=
                velocities[index + 1];

            positionAttribute.array[
                index + 2
            ] +=
                velocities[index + 2];


            /*
             * Frenamos poco a poco.
             */
            velocities[index] *=
                0.97;

            velocities[index + 1] *=
                0.97;

            velocities[index + 2] *=
                0.97;
        }


        /*
         * Después de la explosión comenzamos
         * el desvanecimiento.
         */
        if (
            particles.userData.time >
            1.2
        ) {

            fadeParticles(
                particles
            );
        }
    }


    /* ========================================================
       DESVANECIMIENTO
       ======================================================== */

    if (
        state === "FADING"
    ) {

        particles.userData.time +=
            deltaTime;


        material.opacity =
            Math.max(
                0,
                0.65 -
                particles.userData.time *
                0.7
            );


        /*
         * Continúan subiendo mientras desaparecen.
         */
        for (
            let i = 0;
            i < count;
            i++
        ) {

            const index =
                i * 3;


            positionAttribute.array[
                index + 1
            ] +=
                0.003;
        }


        if (
            material.opacity <= 0
        ) {

            particles.userData.state =
                "HIDDEN";
        }
    }


    positionAttribute.needsUpdate =
        true;
}