// ============================================================
// SKY.JS
// ============================================================
// Este archivo se encarga de crear y animar el cielo nocturno.
//
// El cielo tendrá:
//
// - Estrellas pequeñas.
// - Estrellas grandes.
// - Brillos suaves.
// - Estrellas fugaces.
// - Una nebulosa muy sutil.
//
// Todo está separado del jardín para mantener el proyecto
// organizado y facilitar futuras modificaciones.
//
// main.js
//    ↓
// sky.js
//    ↓
// 🌌 + ✨ + ☄️
// ============================================================

import * as THREE from "three";


// ============================================================
// CONFIGURACIÓN
// ============================================================

// Cantidad de estrellas pequeñas.
//
// Utilizamos THREE.Points para que muchas estrellas puedan
// existir sin crear cientos de Mesh individuales.
const SMALL_STAR_COUNT = 500;


// Cantidad de estrellas grandes.
const LARGE_STAR_COUNT = 35;


// Radio aproximado donde distribuiremos las estrellas.
const SKY_RADIUS = 35;


// ============================================================
// CREAR CIELO
// ============================================================

/**
 * Crea todo el cielo nocturno.
 *
 * @returns {THREE.Group} Grupo que contiene todos los
 * elementos del cielo.
 */
export function createSky() {

    // --------------------------------------------------------
    // GRUPO PRINCIPAL
    // --------------------------------------------------------

    const sky = new THREE.Group();


    // ========================================================
    // ESTRELLAS PEQUEÑAS
    // ========================================================

    const smallStarPositions =
        new Float32Array(
            SMALL_STAR_COUNT * 3
        );


    // Guardaremos información adicional de cada estrella
    // para poder animar su brillo posteriormente.
    const smallStarData = [];


    for (
        let i = 0;
        i < SMALL_STAR_COUNT;
        i++
    ) {

        // ----------------------------------------------------
        // DISTRIBUCIÓN
        // ----------------------------------------------------
        //
        // No queremos que las estrellas estén todas
        // concentradas en una sola zona.
        //
        // Utilizamos una esfera para distribuirlas alrededor
        // de la escena.

        const theta =
            Math.random() * Math.PI * 2;

        const phi =
            Math.acos(
                THREE.MathUtils.lerp(
                    0.15,
                    0.95,
                    Math.random()
                )
            );


        const radius =
            SKY_RADIUS;


        const x =
            radius *
            Math.sin(phi) *
            Math.cos(theta);


        const y =
            radius *
            Math.cos(phi);


        const z =
            radius *
            Math.sin(phi) *
            Math.sin(theta);


        smallStarPositions[i * 3] =
            x;

        smallStarPositions[i * 3 + 1] =
            y;

        smallStarPositions[i * 3 + 2] =
            z;


        // ----------------------------------------------------
        // INFORMACIÓN DE ANIMACIÓN
        // ----------------------------------------------------

        smallStarData.push({

            // Brillo inicial aleatorio.
            baseOpacity:
                0.25 +
                Math.random() * 0.45,

            // Cada estrella parpadeará a una velocidad
            // diferente.
            speed:
                0.3 +
                Math.random() * 1.2,

            // Evita que todas parpadeen al mismo tiempo.
            offset:
                Math.random() *
                Math.PI *
                2

        });
    }


    // --------------------------------------------------------
    // GEOMETRÍA
    // --------------------------------------------------------

    const smallStarGeometry =
        new THREE.BufferGeometry();


    smallStarGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            smallStarPositions,
            3
        )
    );


    // --------------------------------------------------------
    // MATERIAL
    // --------------------------------------------------------

    const smallStarMaterial =
        new THREE.PointsMaterial({

            color: 0xfff4d0,

            size: 0.055,

            transparent: true,

            opacity: 0.55,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending,

            sizeAttenuation: true

        });


    const smallStars =
        new THREE.Points(
            smallStarGeometry,
            smallStarMaterial
        );


    sky.add(
        smallStars
    );


    // Guardamos los datos para la animación.
    smallStars.userData.starData =
        smallStarData;


    smallStars.userData.isSmallStars =
        true;


    // ========================================================
    // ESTRELLAS GRANDES
    // ========================================================

    const largeStars =
        new THREE.Group();


    for (
        let i = 0;
        i < LARGE_STAR_COUNT;
        i++
    ) {

        // ----------------------------------------------------
        // CREAR ESTRELLA
        // ----------------------------------------------------

        const starGeometry =
            new THREE.SphereGeometry(
                0.07 +
                Math.random() * 0.07,
                8,
                8
            );


        const starMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xfff2b8,

                transparent: true,

                opacity:
                    0.55 +
                    Math.random() * 0.35

            });


        const star =
            new THREE.Mesh(
                starGeometry,
                starMaterial
            );


        // ----------------------------------------------------
        // POSICIÓN
        // ----------------------------------------------------

        const theta =
            Math.random() *
            Math.PI *
            2;


        const phi =
            Math.acos(
                THREE.MathUtils.lerp(
                    0.25,
                    0.85,
                    Math.random()
                )
            );


        const radius =
            SKY_RADIUS - 1;


        star.position.x =
            radius *
            Math.sin(phi) *
            Math.cos(theta);


        star.position.y =
            radius *
            Math.cos(phi);


        star.position.z =
            radius *
            Math.sin(phi) *
            Math.sin(theta);


        // ----------------------------------------------------
        // DATOS PARA ANIMACIÓN
        // ----------------------------------------------------

        star.userData.animationOffset =
            Math.random() *
            Math.PI *
            2;


        star.userData.animationSpeed =
            0.4 +
            Math.random() * 0.8;


        star.userData.baseScale =
            star.scale.x;


        largeStars.add(
            star
        );
    }


    sky.add(
        largeStars
    );


    largeStars.userData.isLargeStars =
        true;


    // ========================================================
    // ESTRELLA FUGAZ
    // ========================================================
    //
    // No creamos constantemente estrellas fugaces.
    //
    // Creamos un objeto reutilizable que permanecerá oculto
    // hasta que llegue el momento de utilizarlo.
    // ========================================================

    const shootingStar =
        createShootingStar();


    shootingStar.visible =
        false;


    sky.add(
        shootingStar
    );


    sky.userData.shootingStar =
        shootingStar;


    // Tiempo restante antes de intentar generar
    // otra estrella fugaz.
    sky.userData.shootingStarTimer =
        4 +
        Math.random() * 6;


    // ========================================================
    // NEBULOSA
    // ========================================================
    //
    // Una esfera grande y transparente detrás de las estrellas.
    //
    // No intenta representar una nebulosa real.
    //
    // Su objetivo es crear una ligera sensación de color
    // en el cielo.
    // ========================================================

    const nebulaGeometry =
        new THREE.SphereGeometry(
            28,
            32,
            32
        );


    const nebulaMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x17152f,

            transparent: true,

            opacity: 0.10,

            side:
                THREE.BackSide,

            depthWrite: false

        });


    const nebula =
        new THREE.Mesh(
            nebulaGeometry,
            nebulaMaterial
        );


    sky.add(
        nebula
    );


    sky.userData.nebula =
        nebula;


    // ========================================================
    // INFORMACIÓN GENERAL
    // ========================================================

    sky.userData.isSky =
        true;


    return sky;
}


// ============================================================
// CREAR ESTRELLA FUGAZ
// ============================================================

/**
 * Crea una estrella fugaz reutilizable.
 *
 * La estrella está formada por:
 *
 * - Una pequeña esfera luminosa.
 * - Una línea que representa su cola.
 */
function createShootingStar() {

    const shootingStar =
        new THREE.Group();


    // --------------------------------------------------------
    // CABEZA
    // --------------------------------------------------------

    const headGeometry =
        new THREE.SphereGeometry(
            0.09,
            10,
            10
        );


    const headMaterial =
        new THREE.MeshBasicMaterial({

            color: 0xffffff,

            transparent: true,

            opacity: 1

        });


    const head =
        new THREE.Mesh(
            headGeometry,
            headMaterial
        );


    shootingStar.add(
        head
    );


    // --------------------------------------------------------
    // COLA
    // --------------------------------------------------------

    const trailGeometry =
        new THREE.BufferGeometry();


    const trailPositions =
        new Float32Array([
            0, 0, 0,

            -1.4, 0.45, 0
        ]);


    trailGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            trailPositions,
            3
        )
    );


    const trailMaterial =
        new THREE.LineBasicMaterial({

            color: 0xfff1bd,

            transparent: true,

            opacity: 0.75,

            blending:
                THREE.AdditiveBlending

        });


    const trail =
        new THREE.Line(
            trailGeometry,
            trailMaterial
        );


    shootingStar.add(
        trail
    );


    // --------------------------------------------------------
    // DATOS
    // --------------------------------------------------------

    shootingStar.userData.head =
        head;


    shootingStar.userData.trail =
        trail;


    shootingStar.userData.active =
        false;


    shootingStar.userData.progress =
        0;


    return shootingStar;
}


// ============================================================
// ACTIVAR ESTRELLA FUGAZ
// ============================================================

function launchShootingStar(
    shootingStar
) {

    shootingStar.visible =
        true;


    shootingStar.userData.active =
        true;


    shootingStar.userData.progress =
        0;


    // --------------------------------------------------------
    // POSICIÓN INICIAL
    // --------------------------------------------------------

    shootingStar.position.set(

        -8 +
        Math.random() * 8,

        7 +
        Math.random() * 5,

        -4 -
        Math.random() * 6

    );


    // --------------------------------------------------------
    // ROTACIÓN
    // --------------------------------------------------------

    shootingStar.rotation.z =
        -0.35;


    // --------------------------------------------------------
    // ESCALA
    // --------------------------------------------------------

    shootingStar.scale.setScalar(
        0.8 +
        Math.random() * 0.5
    );
}


// ============================================================
// ANIMAR CIELO
// ============================================================

/**
 * Actualiza todos los elementos animados del cielo.
 *
 * @param {THREE.Group} sky
 * @param {number} elapsedTime
 * @param {number} deltaTime
 */
export function animateSky(
    sky,
    elapsedTime,
    deltaTime
) {

    if (!sky) {
        return;
    }


    // ========================================================
    // ESTRELLAS PEQUEÑAS
    // ========================================================

    const smallStars =
        sky.children.find(
            (child) =>
                child.userData?.isSmallStars
        );


    if (smallStars) {

        const starData =
            smallStars.userData.starData;


        let totalBrightness = 0;


        for (
            let i = 0;
            i < starData.length;
            i++
        ) {

            const star =
                starData[i];


            totalBrightness +=
                Math.sin(
                    elapsedTime *
                    star.speed +
                    star.offset
                ) *
                0.15;
        }


        const averageBrightness =
            totalBrightness /
            starData.length;


        smallStars.material.opacity =
            0.55 +
            averageBrightness;
    }


    // ========================================================
    // ESTRELLAS GRANDES
    // ========================================================

    const largeStars =
        sky.children.find(
            (child) =>
                child.userData?.isLargeStars
        );


    if (largeStars) {

        largeStars.children.forEach(
            (star) => {

                const offset =
                    star.userData
                        .animationOffset;


                const speed =
                    star.userData
                        .animationSpeed;


                const pulse =
                    1 +
                    Math.sin(
                        elapsedTime *
                        speed +
                        offset
                    ) *
                    0.18;


                star.scale.setScalar(
                    pulse
                );


                star.material.opacity =
                    0.65 +
                    Math.sin(
                        elapsedTime *
                        speed +
                        offset
                    ) *
                    0.2;

            }
        );
    }


    // ========================================================
    // NEBULOSA
    // ========================================================

    const nebula =
        sky.userData.nebula;


    if (nebula) {

        // Movimiento extremadamente lento.
        //
        // Debe sentirse, no notarse.
        nebula.rotation.y +=
            deltaTime * 0.003;

        nebula.rotation.x +=
            deltaTime * 0.001;
    }


    // ========================================================
    // ESTRELLA FUGAZ
    // ========================================================

    const shootingStar =
        sky.userData.shootingStar;


    if (!shootingStar) {
        return;
    }


    // --------------------------------------------------------
    // SI ESTÁ ACTIVA
    // --------------------------------------------------------

    if (
        shootingStar.userData.active
    ) {

        shootingStar.userData.progress +=
            deltaTime * 0.8;


        const progress =
            shootingStar.userData.progress;


        // Movimiento diagonal.
        shootingStar.position.x +=
            deltaTime * 7;


        shootingStar.position.y -=
            deltaTime * 4;


        // ----------------------------------------------------
        // DESAPARICIÓN
        // ----------------------------------------------------

        if (progress > 0.65) {

            const fade =
                1 -
                (
                    progress - 0.65
                ) / 0.35;


            shootingStar.userData.head
                .material.opacity =
                Math.max(
                    fade,
                    0
                );


            shootingStar.userData.trail
                .material.opacity =
                Math.max(
                    fade * 0.75,
                    0
                );
        }


        // ----------------------------------------------------
        // TERMINÓ
        // ----------------------------------------------------

        if (progress >= 1) {

            shootingStar.visible =
                false;


            shootingStar.userData.active =
                false;


            sky.userData.shootingStarTimer =
                5 +
                Math.random() * 9;
        }


    } else {

        // ----------------------------------------------------
        // ESPERANDO
        // ----------------------------------------------------

        sky.userData.shootingStarTimer -=
            deltaTime;


        if (
            sky.userData.shootingStarTimer <= 0
        ) {

            launchShootingStar(
                shootingStar
            );
        }
    }
}