// ============================================================
// MAIN.JS
// ============================================================
//
// Control principal de nuestra experiencia romántica.
//
// La experiencia funciona como una pequeña película interactiva.
//
// El primer TAP obligatorio será:
//
//      tocar la flor
//
// Después de despertar la flor:
//
//      TEXTO
//        ↓
//      LA PERSONA LEE
//        ↓
//      TAP
//        ↓
//      TRANSICIÓN DE CÁMARA
//        ↓
//      NUEVO TEXTO
//        ↓
//      TAP
//        ↓
//      NUEVA TRANSICIÓN
//
// De esta manera la persona controla completamente
// el ritmo de lectura.
//
// Mientras avanzamos:
//
//      NOCHE
//        ↓
//      MADRUGADA
//        ↓
//      PRIMERAS LUCES
//        ↓
//      AMANECER
//        ↓
//      AMANECER COMPLETO
//
// ============================================================


import * as THREE from "three";

import { createFlower } from "./flower.js";

import {
    createParticles,
    showParticles,
    burstParticles,
    animateParticles
} from "./particles.js";

import { createGarden } from "./garden.js";

import {
    createSky,
    animateSky
} from "./sky.js";


// ============================================================
// ESCENA 3D
// ============================================================

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(
        0x05060a
    );


// ============================================================
// CÁMARA
// ============================================================

const camera =
    new THREE.PerspectiveCamera(
        60,
        window.innerWidth /
            window.innerHeight,
        0.1,
        1000
    );

camera.position.set(
    0,
    1.5,
    5
);


// ============================================================
// RENDERER
// ============================================================

const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

document
    .getElementById(
        "scene-container"
    )
    .appendChild(
        renderer.domElement
    );


// ============================================================
// ILUMINACIÓN GENERAL
// ============================================================

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        0.15
    );

scene.add(
    ambientLight
);


// ============================================================
// LUZ AZUL DE MADRUGADA
// ============================================================

const dawnLight =
    new THREE.HemisphereLight(
        0x6f78a8,
        0x24160e,
        0
    );

scene.add(
    dawnLight
);


// ============================================================
// LUZ CÁLIDA DEL AMANECER
// ============================================================

const sunriseLight =
    new THREE.DirectionalLight(
        0xffc978,
        0
    );

sunriseLight.position.set(
    -10,
    4,
    -12
);

scene.add(
    sunriseLight
);


// ============================================================
// LUZ FINAL DEL SOL
// ============================================================
//
// Esta luz será mucho más importante cerca del final.
//
// No aparece al principio.
//
// ============================================================

const finalSunLight =
    new THREE.DirectionalLight(
        0xffd78a,
        0
    );

finalSunLight.position.set(
    -12,
    8,
    -18
);

scene.add(
    finalSunLight
);


// ============================================================
// PROGRESO DEL AMANECER
// ============================================================
//
// 0.00 = noche
// 0.20 = madrugada
// 0.40 = primeras luces
// 0.60 = horizonte iluminándose
// 0.80 = amanecer
// 1.00 = amanecer completo
//
// ============================================================

let sunriseProgress = 0;


// ============================================================
// ACTUALIZAR AMANECER
// ============================================================

function setSunriseProgress(
    progress
) {

    sunriseProgress =
        THREE.MathUtils.clamp(
            progress,
            0,
            1
        );


    // --------------------------------------------------------
    // LUZ AMBIENTE
    // --------------------------------------------------------

    ambientLight.intensity =
        THREE.MathUtils.lerp(
            0.15,
            0.65,
            sunriseProgress
        );


    // --------------------------------------------------------
    // LUZ AZUL DE MADRUGADA
    // --------------------------------------------------------

    dawnLight.intensity =
        THREE.MathUtils.lerp(
            0,
            0.55,
            Math.min(
                sunriseProgress * 1.4,
                1
            )
        );


    // --------------------------------------------------------
    // LUZ DORADA
    // --------------------------------------------------------

    sunriseLight.intensity =
        THREE.MathUtils.lerp(
            0,
            1.15,
            sunriseProgress
        );


    // --------------------------------------------------------
    // LUZ FINAL
    // --------------------------------------------------------

    finalSunLight.intensity =
        THREE.MathUtils.lerp(
            0,
            1.8,
            Math.max(
                0,
                (sunriseProgress - 0.55) /
                    0.45
            )
        );


    // ========================================================
    // COLOR DEL CIELO
    // ========================================================

    const nightColor =
        new THREE.Color(
            0x05060a
        );

    const midnightColor =
        new THREE.Color(
            0x171b35
        );

    const dawnColor =
        new THREE.Color(
            0x493d52
        );

    const sunriseColor =
        new THREE.Color(
            0xb06b5c
        );

    const morningColor =
        new THREE.Color(
            0xe5a66d
        );


    let currentColor;


    // --------------------------------------------------------
    // NOCHE → MADRUGADA
    // --------------------------------------------------------

    if (
        sunriseProgress < 0.25
    ) {

        const progress =
            sunriseProgress / 0.25;

        currentColor =
            nightColor.clone().lerp(
                midnightColor,
                progress
            );
    }


    // --------------------------------------------------------
    // MADRUGADA → PRIMERAS LUCES
    // --------------------------------------------------------

    else if (
        sunriseProgress < 0.5
    ) {

        const progress =
            (sunriseProgress - 0.25) /
            0.25;

        currentColor =
            midnightColor.clone().lerp(
                dawnColor,
                progress
            );
    }


    // --------------------------------------------------------
    // PRIMERAS LUCES → AMANECER
    // --------------------------------------------------------

    else if (
        sunriseProgress < 0.8
    ) {

        const progress =
            (sunriseProgress - 0.5) /
            0.3;

        currentColor =
            dawnColor.clone().lerp(
                sunriseColor,
                progress
            );
    }


    // --------------------------------------------------------
    // AMANECER → MAÑANA
    // --------------------------------------------------------

    else {

        const progress =
            (sunriseProgress - 0.8) /
            0.2;

        currentColor =
            sunriseColor.clone().lerp(
                morningColor,
                progress
            );
    }


    scene.background =
        currentColor;
}


// ============================================================
// INICIAR EN NOCHE COMPLETA
// ============================================================

setSunriseProgress(
    0
);


// ============================================================
// FLOR PRINCIPAL
// ============================================================

const mainFlower =
    createFlower();

scene.add(
    mainFlower
);


// ============================================================
// PARTÍCULAS MÁGICAS
// ============================================================

const magicParticles =
    createParticles(
        120
    );

scene.add(
    magicParticles
);


// ============================================================
// JARDÍN
// ============================================================

const garden =
    createGarden();

scene.add(
    garden
);


// ============================================================
// CIELO
// ============================================================

const sky =
    createSky();

scene.add(
    sky
);

sky.visible =
    false;


// ============================================================
// ESTADOS
// ============================================================

const STATES = {

    INTRO:
        "INTRO",

    FLOWER_AWAKENING:
        "FLOWER_AWAKENING",

    GARDEN_TRANSITION:
        "GARDEN_TRANSITION",

    GARDEN:
        "GARDEN",

    SECOND_GARDEN_TRANSITION:
        "SECOND_GARDEN_TRANSITION",

    SECOND_GARDEN:
        "SECOND_GARDEN",

    // --------------------------------------------------------
    // Transición que lleva desde el segundo rincón del jardín
    // hasta la primera escena cinematográfica.
    // --------------------------------------------------------

    DAWN_TRANSITION:
        "DAWN_TRANSITION",

    // --------------------------------------------------------
    // Nueva transición especial.
    //
    // Esta conecta:
    //
    // "Hay algo que quiero decirte..."
    //
    // con:
    //
    // "A pesar de todos mis errores..."
    //
    // La cámara se adentra físicamente en el jardín.
    // --------------------------------------------------------

    LOVE_JOURNEY_TRANSITION:
        "LOVE_JOURNEY_TRANSITION",

    CINEMATIC_TRANSITION:
        "CINEMATIC_TRANSITION",

    CINEMATIC_SCENE:
        "CINEMATIC_SCENE",

    FINAL:
        "FINAL"
};


// ============================================================
// ESTADO ACTUAL
// ============================================================

let state =
    STATES.INTRO;


// ============================================================
// BLOQUEO DE INTERACCIÓN
// ============================================================
//
// true  = no permitimos TAP
// false = permitimos TAP
//
// Durante una transición bloqueamos la interacción.
//
// Cuando aparece una frase, desbloqueamos la pantalla
// para que la persona pueda tocar cuando termine de leer.
//
// ============================================================

let interactionLocked =
    false;


// ============================================================
// TIEMPO DE LA ESCENA
// ============================================================

let stateTime =
    0;


// ============================================================
// TIEMPO GENERAL
// ============================================================

let previousTime =
    performance.now();


// ============================================================
// ELEMENTOS HTML
// ============================================================

const introTitle =
    document.getElementById(
        "intro-title"
    );

const introSubtitle =
    document.getElementById(
        "intro-subtitle"
    );


// ============================================================
// TEXTO INICIAL
// ============================================================
//
// Después de unos segundos aparece:
//
// "Toca la flor 🌻"
//
// ============================================================

setTimeout(() => {

    introSubtitle.classList.add(
        "show"
    );

}, 3500);


// ============================================================
// RAYCASTER
// ============================================================
//
// El Raycaster permite detectar qué objeto 3D
// tocó la persona.
//
// ============================================================

const raycaster =
    new THREE.Raycaster();

const pointer =
    new THREE.Vector2();


// ============================================================
// EVENTO DE TAP
// ============================================================

renderer.domElement.addEventListener(
    "pointerdown",
    handlePointerDown
);


// ============================================================
// MANEJAR TAP
// ============================================================

function handlePointerDown(
    event
) {

    // ========================================================
    // BLOQUEAR TAP DURANTE TRANSICIONES
    // ========================================================

    /*
     * Si la cámara está realizando una transición,
     * ignoramos cualquier TAP.
     *
     * Esto evita que un toque accidental pueda
     * saltarse una escena.
     */

    if (
        interactionLocked
    ) {
        return;
    }


    // ========================================================
    // PRIMER TAP — DESPERTAR LA FLOR
    // ========================================================

    /*
     * Al principio el único TAP válido es tocar
     * directamente la flor principal.
     */

    if (
        state === STATES.INTRO
    ) {

        pointer.x =
            (event.clientX /
                window.innerWidth) *
                2 -
            1;

        pointer.y =
            -(event.clientY /
                window.innerHeight) *
                2 +
            1;


        // ----------------------------------------------------
        // Lanzamos un rayo desde la cámara hacia
        // donde la persona tocó.
        // ----------------------------------------------------

        raycaster.setFromCamera(
            pointer,
            camera
        );


        // ----------------------------------------------------
        // Comprobamos si tocó la flor.
        // ----------------------------------------------------

        const intersections =
            raycaster.intersectObject(
                mainFlower,
                true
            );


        if (
            intersections.length > 0
        ) {

            awakenFlower();
        }

        return;
    }


    // ========================================================
    // TAP EN EL JARDÍN
    // ========================================================

    /*
     * Una vez que hemos llegado al jardín,
     * cualquier TAP sirve para continuar.
     */

    if (
        state === STATES.GARDEN
    ) {

        beginSecondGardenTransition();

        return;
    }


    // ========================================================
    // TAP EN LA SEGUNDA ESCENA DEL JARDÍN
    // ========================================================

    /*
     * La primera vez que estamos en SECOND_GARDEN,
     * hacemos la transición especial hacia:
     *
     * "Hay algo que quiero decirte..."
     *
     * --------------------------------------------------------
     *
     * Después de que empiece la secuencia cinematográfica,
     * SECOND_GARDEN se reutiliza como estado de espera entre
     * escenas.
     *
     * En ese caso ya no hacemos DAWN_TRANSITION.
     *
     * Hacemos la transición cinematográfica normal.
     */

    if (
        state === STATES.SECOND_GARDEN
    ) {

        // ----------------------------------------------------
        // Primera escena cinematográfica.
        // ----------------------------------------------------

        if (
            cinematicIndex === 0
        ) {

            beginDawnTransition();

        }

        // ----------------------------------------------------
        // Escenas posteriores.
        // ----------------------------------------------------

        else {

            startCinematicTransition();

        }

        return;
    }


    // ========================================================
    // TAP EN UNA ESCENA CINEMATOGRÁFICA
    // ========================================================

    /*
     * Cada mensaje cinematográfico permanece visible
     * hasta que la persona decide continuar.
     */

    if (
        state === STATES.CINEMATIC_SCENE
    ) {

        finishCinematicScene();

        return;
    }
}


// ============================================================
// DESPERTAR LA FLOR
// ============================================================

function awakenFlower() {

    interactionLocked =
        true;

    state =
        STATES.FLOWER_AWAKENING;

    stateTime =
        0;


    // --------------------------------------------------------
    // Texto
    // --------------------------------------------------------

    introSubtitle.textContent =
        "✨ Has despertado la flor ✨";


    // --------------------------------------------------------
    // Partículas
    // --------------------------------------------------------

    showParticles(
        magicParticles
    );


    // --------------------------------------------------------
    // Explosión
    // --------------------------------------------------------

    setTimeout(() => {

        burstParticles(
            magicParticles
        );

    }, 250);


    // --------------------------------------------------------
    // Continuar automáticamente
    // --------------------------------------------------------

    /*
     * Esta es la única transición automática después
     * del primer TAP.
     *
     * La flor despierta y después de 1.5 segundos
     * comienza a revelarse el jardín.
     */

    setTimeout(() => {

        beginGardenTransition();

    }, 1500);
}


// ============================================================
// TRANSICIÓN FLOR → JARDÍN
// ============================================================

function beginGardenTransition() {

    interactionLocked =
        true;

    state =
        STATES.GARDEN_TRANSITION;

    stateTime =
        0;


    garden.visible =
        true;

    sky.visible =
        true;


    // --------------------------------------------------------
    // Las flores comienzan pequeñas.
    // --------------------------------------------------------

    garden.userData.flowers.forEach(
        flower => {

            flower.scale.set(
                0.01,
                0.01,
                0.01
            );

            flower.visible =
                true;
        }
    );


    prepareSkyForReveal();


    introSubtitle.style.opacity =
        "0";
}


// ============================================================
// PREPARAR CIELO
// ============================================================

function prepareSkyForReveal() {

    sky.traverse(
        object => {

            if (
                object.material &&
                object.material.transparent
            ) {

                if (
                    object.userData.originalOpacity ===
                    undefined
                ) {

                    object.userData.originalOpacity =
                        object.material.opacity;
                }


                object.material.opacity =
                    0;
            }
        }
    );
}


// ============================================================
// TRANSICIÓN FLOR → JARDÍN
// ============================================================

function animateGardenTransition(
    elapsedTime
) {

    const duration =
        4.5;

    const progress =
        Math.min(
            elapsedTime / duration,
            1
        );

    const smooth =
        easeInOutCubic(
            progress
        );


    // ========================================================
    // FLOR PRINCIPAL
    // ========================================================

    const flowerScale =
        THREE.MathUtils.lerp(
            1,
            0.05,
            smooth
        );

    mainFlower.scale.set(
        flowerScale,
        flowerScale,
        flowerScale
    );


    // ========================================================
    // CÁMARA
    // ========================================================

    camera.position.x =
        THREE.MathUtils.lerp(
            0,
            2.4,
            smooth
        );

    camera.position.y =
        THREE.MathUtils.lerp(
            1.5,
            3.8,
            smooth
        );

    camera.position.z =
        THREE.MathUtils.lerp(
            5,
            10,
            smooth
        );

    camera.lookAt(
        0,
        0.8,
        0
    );


    // ========================================================
    // FLORES
    // ========================================================

    const flowers =
        garden.userData.flowers;

    flowers.forEach(
        (
            flower,
            index
        ) => {

            const delay =
                (index /
                    flowers.length) *
                0.55;

            const flowerProgress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        (progress - delay) /
                            (1 - delay)
                    )
                );

            const flowerEase =
                easeOutBack(
                    flowerProgress
                );

            const targetScale =
                flower.userData.baseScale;

            const scale =
                targetScale *
                flowerEase;

            flower.scale.set(
                scale,
                scale,
                scale
            );
        }
    );


    // ========================================================
    // CIELO
    // ========================================================

    if (
        progress > 0.15
    ) {

        const skyProgress =
            Math.min(
                1,
                (progress - 0.15) /
                    0.65
            );

        revealSky(
            skyProgress
        );
    }


    // ========================================================
    // FINAL
    // ========================================================

    if (
        progress >= 1
    ) {

        state =
            STATES.GARDEN;

        stateTime =
            0;


        /*
         * Ya terminamos la transición.
         *
         * Ahora la persona puede leer tranquilamente.
         */

        interactionLocked =
            false;


        // ----------------------------------------------------
        // Primera frase del jardín.
        // ----------------------------------------------------

        introSubtitle.textContent =
            "Quizá sea solo una flor...";

        introSubtitle.style.opacity =
            "1";


        // ----------------------------------------------------
        // Primera pequeña subida de luz.
        // ----------------------------------------------------

        setSunriseProgress(
            0.08
        );
    }
}


// ============================================================
// REVELAR CIELO
// ============================================================

function revealSky(
    progress
) {

    sky.traverse(
        object => {

            if (
                object.material &&
                object.material.transparent &&
                object.userData.originalOpacity !==
                    undefined
            ) {

                object.material.opacity =
                    object.userData.originalOpacity *
                    progress;
            }
        }
    );
}


// ============================================================
// SEGUNDA TRANSICIÓN
// ============================================================
//
// Jardín → otro rincón del mismo jardín.
//
// ============================================================

function beginSecondGardenTransition() {

    interactionLocked =
        true;

    state =
        STATES.SECOND_GARDEN_TRANSITION;

    stateTime =
        0;

    introSubtitle.style.opacity =
        "0";
}


// ============================================================
// ANIMAR SEGUNDA TRANSICIÓN
// ============================================================

function animateSecondGardenTransition(
    elapsedTime
) {

    const duration =
        3.5;

    const progress =
        Math.min(
            elapsedTime / duration,
            1
        );

    const smooth =
        easeInOutCubic(
            progress
        );


    // ========================================================
    // CÁMARA
    // ========================================================

    camera.position.x =
        THREE.MathUtils.lerp(
            2.4,
            -4.2,
            smooth
        );

    camera.position.y =
        THREE.MathUtils.lerp(
            3.8,
            3.2,
            smooth
        );

    camera.position.z =
        THREE.MathUtils.lerp(
            10,
            7,
            smooth
        );


    const lookX =
        THREE.MathUtils.lerp(
            0,
            -1.8,
            smooth
        );

    const lookY =
        THREE.MathUtils.lerp(
            0.8,
            1.0,
            smooth
        );

    const lookZ =
        THREE.MathUtils.lerp(
            0,
            -1.5,
            smooth
        );


    camera.lookAt(
        lookX,
        lookY,
        lookZ
    );


    // ========================================================
    // JARDÍN
    // ========================================================

    animateGarden(
        performance.now() / 1000
    );


    // ========================================================
    // LUZ
    // ========================================================

    const currentLight =
        THREE.MathUtils.lerp(
            0.08,
            0.18,
            smooth
        );

    setSunriseProgress(
        currentLight
    );


    // ========================================================
    // FINAL
    // ========================================================

    if (
        progress >= 1
    ) {

        state =
            STATES.SECOND_GARDEN;

        stateTime =
            0;


        /*
         * La transición terminó.
         *
         * Ahora el usuario puede leer el texto
         * y tocar cuando esté listo.
         */

        interactionLocked =
            false;


        // ----------------------------------------------------
        // Mostrar segundo mensaje del jardín.
        // ----------------------------------------------------

        introSubtitle.textContent =
            "pero quería darte algo que pudiera guardar un poquito de lo que siento por ti.";

        introSubtitle.style.opacity =
            "1";


        // ----------------------------------------------------
        // El amanecer avanza ligeramente.
        // ----------------------------------------------------

        setSunriseProgress(
            0.18
        );
    }
}


// ============================================================
// TRANSICIÓN ESPECIAL HACIA EL AMANECER
// ============================================================
//
// Esta transición conecta:
//
// SECOND_GARDEN
//      ↓
// DAWN_TRANSITION
//      ↓
// movimiento cinematográfico continuo
//      ↓
// primeras luces
//      ↓
// "Hay algo que quiero decirte..."
//
// ============================================================

function beginDawnTransition() {

    interactionLocked =
        true;

    state =
        STATES.DAWN_TRANSITION;

    stateTime =
        0;

    introSubtitle.style.opacity =
        "0";
}


// ============================================================
// ANIMAR TRANSICIÓN DEL AMANECER
// ============================================================
//
// La cámara continúa exactamente desde:
//
//      (-4.2, 3.2, 7)
//
// y realiza un arco suave hacia:
//
//      (1.0, 4.0, 9.0)
//
// ============================================================

function animateDawnTransition(
    elapsedTime
) {

    const duration =
        4.5;

    const progress =
        Math.min(
            elapsedTime / duration,
            1
        );

    const smooth =
        easeInOutCubic(
            progress
        );


    // ========================================================
    // POSICIÓN INICIAL
    // ========================================================

    const startX =
        -4.2;

    const startY =
        3.2;

    const startZ =
        7.0;


    // ========================================================
    // POSICIÓN FINAL
    // ========================================================

    const endX =
        1.0;

    const endY =
        4.0;

    const endZ =
        9.0;


    // ========================================================
    // ARCO CINEMATOGRÁFICO
    // ========================================================

    const arc =
        Math.sin(
            smooth * Math.PI
        );


    camera.position.x =
        THREE.MathUtils.lerp(
            startX,
            endX,
            smooth
        ) +
        arc * 1.1;

    camera.position.y =
        THREE.MathUtils.lerp(
            startY,
            endY,
            smooth
        ) +
        arc * 0.35;

    camera.position.z =
        THREE.MathUtils.lerp(
            startZ,
            endZ,
            smooth
        );


    // ========================================================
    // MIRADA
    // ========================================================

    const lookX =
        THREE.MathUtils.lerp(
            -1.8,
            0,
            smooth
        );

    const lookY =
        THREE.MathUtils.lerp(
            1.0,
            1.1,
            smooth
        );

    const lookZ =
        THREE.MathUtils.lerp(
            -1.5,
            -1.0,
            smooth
        );


    camera.lookAt(
        lookX,
        lookY,
        lookZ
    );


    // ========================================================
    // JARDÍN
    // ========================================================

    animateGarden(
        performance.now() / 1000
    );


    // ========================================================
    // AMANECER
    // ========================================================

    const currentSunrise =
        THREE.MathUtils.lerp(
            0.18,
            0.25,
            smooth
        );

    setSunriseProgress(
        currentSunrise
    );


    // ========================================================
    // FINAL DE LA TRANSICIÓN
    // ========================================================

    if (
        progress >= 1
    ) {

        state =
            STATES.CINEMATIC_SCENE;

        stateTime =
            0;

        interactionLocked =
            false;


        // ----------------------------------------------------
        // La primera escena es:
        //
        // "Hay algo que quiero decirte..."
        // ----------------------------------------------------

        cinematicIndex =
            0;


        delete cinematicScenes[0].startCamera;
        delete cinematicScenes[0].startLook;


        // ----------------------------------------------------
        // Mostrar el texto.
        // ----------------------------------------------------

        prepareCinematicScene();
    }
}


// ============================================================
// TRANSICIÓN: "HAY ALGO QUE QUIERO DECIRTE..."
//              ↓
//             TAP
//              ↓
// "A PESAR DE TODOS MIS ERRORES..."
// ============================================================
//
// Esta transición representa el comienzo real del
// recorrido romántico.
//
// La cámara:
//      - avanza
//      - baja ligeramente
//      - hace una pequeña curva
//      - cambia progresivamente el punto de mirada
//
// No hacemos un simple salto entre coordenadas.
//
// La intención es que parezca que seguimos recorriendo
// físicamente el mismo jardín.
//
// ============================================================

function animateLoveJourneyTransition(
    elapsedTime
) {

    // --------------------------------------------------------
    // DURACIÓN
    // --------------------------------------------------------

    const duration =
        4.8;


    const progress =
        Math.min(
            elapsedTime / duration,
            1
        );


    // --------------------------------------------------------
    // SUAVIZADO
    // --------------------------------------------------------

    const smooth =
        easeInOutCubic(
            progress
        );


    // ========================================================
    // POSICIÓN INICIAL
    // ========================================================
    //
    // Esta es exactamente la posición donde terminó
    // la transición del amanecer.
    //
    // ========================================================

    const startX =
        1.0;

    const startY =
        4.0;

    const startZ =
        9.0;


    // ========================================================
    // POSICIÓN FINAL
    // ========================================================
    //
    // Entramos más profundamente en el jardín.
    //
    // ========================================================

    const endX =
        -1.5;

    const endY =
        2.6;

    const endZ =
        5.5;


    // ========================================================
    // CURVA DE RECORRIDO
    // ========================================================
    //
    // El seno crea una curva suave.
    //
    // La cámara se desplaza ligeramente hacia un lado
    // durante el recorrido y después vuelve a la trayectoria.
    //
    // ========================================================

    const curve =
        Math.sin(
            smooth * Math.PI
        );


    // ========================================================
    // MOVIMIENTO DE CÁMARA
    // ========================================================

    camera.position.x =
        THREE.MathUtils.lerp(
            startX,
            endX,
            smooth
        ) -
        curve * 0.7;


    camera.position.y =
        THREE.MathUtils.lerp(
            startY,
            endY,
            smooth
        ) +
        curve * 0.15;


    camera.position.z =
        THREE.MathUtils.lerp(
            startZ,
            endZ,
            smooth
        );


    // ========================================================
    // PUNTO DE MIRADA
    // ========================================================
    //
    // No solo movemos la cámara.
    //
    // También hacemos que mire progresivamente hacia
    // otra zona del jardín.
    //
    // ========================================================

    const lookX =
        THREE.MathUtils.lerp(
            0,
            -0.2,
            smooth
        );


    const lookY =
        THREE.MathUtils.lerp(
            1.1,
            1.0,
            smooth
        );


    const lookZ =
        THREE.MathUtils.lerp(
            -1.0,
            -1.5,
            smooth
        );


    camera.lookAt(
        lookX,
        lookY,
        lookZ
    );


    // ========================================================
    // JARDÍN
    // ========================================================

    animateGarden(
        performance.now() / 1000
    );


    // ========================================================
    // AMANECER
    // ========================================================
    //
    // Solo aumentamos un poco la luz.
    //
    // Todavía estamos en una etapa temprana del amanecer.
    //
    // ========================================================

    const currentSunrise =
        THREE.MathUtils.lerp(
            0.25,
            0.27,
            smooth
        );


    setSunriseProgress(
        currentSunrise
    );


    // ========================================================
    // FINAL
    // ========================================================

    if (
        progress >= 1
    ) {

        state =
            STATES.CINEMATIC_SCENE;

        stateTime =
            0;

        interactionLocked =
            false;


        // ----------------------------------------------------
        // Ahora pasamos a:
        //
        // "A pesar de todos mis errores..."
        //
        // ----------------------------------------------------

        cinematicIndex =
            1;


        delete cinematicScenes[1].startCamera;
        delete cinematicScenes[1].startLook;


        // ----------------------------------------------------
        // Mostrar el nuevo texto.
        // ----------------------------------------------------

        prepareCinematicScene();
    }
}


// ============================================================
// SECUENCIA CINEMATOGRÁFICA
// ============================================================
//
// Cada escena contiene:
//
//      texto
//      posición de cámara
//      punto de mirada
//      nivel de amanecer
//
// IMPORTANTE:
//
// Ya no utilizamos "duration" para decidir cuándo
// avanzar automáticamente.
//
// Conservamos esos valores por ahora porque pueden
// servirnos posteriormente para efectos especiales,
// pero el usuario controla el avance mediante TAP.
//
// ============================================================

const cinematicScenes = [

    // ========================================================
    // ESCENA 4
    // ========================================================

    {
        text:
            "Hay algo que quiero decirte...",

        camera:
            {
                x: 1.0,
                y: 4.0,
                z: 9.0
            },

        look:
            {
                x: 0,
                y: 1.1,
                z: -1.0
            },

        duration:
            4500,

        sunrise:
            0.25
    },


    // ========================================================
    // ESCENA 5
    // ========================================================

    {
        text:
            "A pesar de todos mis errores...",

        camera:
            {
                x: -1.5,
                y: 2.6,
                z: 5.5
            },

        look:
            {
                x: 0,
                y: 1,
                z: -2
            },

        duration:
            4000,

        sunrise:
            0.27
    },


    // ========================================================
    // ESCENA 6
    // ========================================================

    {
        text:
            "y de las veces que quizá te he dado problemas...",

        camera:
            {
                x: 1.8,
                y: 2.8,
                z: 5.8
            },

        look:
            {
                x: 0.8,
                y: 1,
                z: -2
            },

        duration:
            4500,

        sunrise:
            0.32
    },


    // ========================================================
    // ESCENA 7
    // ========================================================

    {
        text:
            "hay algo que nunca ha cambiado.",

        camera:
            {
                x: 3.2,
                y: 2.5,
                z: 5
            },

        look:
            {
                x: 1,
                y: 1.2,
                z: -1
            },

        duration:
            4500,

        sunrise:
            0.38
    },


    // ========================================================
    // ESCENA 8
    // ========================================================

    {
        text:
            "TE AMO. ❤️",

        camera:
            {
                x: 0,
                y: 3.8,
                z: 8
            },

        look:
            {
                x: 0,
                y: 1,
                z: 0
            },

        duration:
            5500,

        sunrise:
            0.45,

        love:
            true
    },


    // ========================================================
    // ESCENA 9
    // ========================================================

    {
        text:
            "Te amo muchísimo... más de lo que a veces sé cómo expresar.",

        camera:
            {
                x: -3,
                y: 3,
                z: 6
            },

        look:
            {
                x: -1,
                y: 1,
                z: -1
            },

        duration:
            5000,

        sunrise:
            0.52
    },


    // ========================================================
    // ESCENA 10
    // ========================================================

    {
        text:
            "Y quizá por eso también tengo miedo.",

        camera:
            {
                x: 3,
                y: 3,
                z: 6
            },

        look:
            {
                x: 1,
                y: 1,
                z: -1
            },

        duration:
            4500,

        sunrise:
            0.58
    },


    // ========================================================
    // ESCENA 11
    // ========================================================

    {
        text:
            "Tengo miedo de perderte, porque eres demasiado importante para mí.",

        camera:
            {
                x: 0,
                y: 2.8,
                z: 5
            },

        look:
            {
                x: 0,
                y: 1,
                z: -2
            },

        duration:
            5500,

        sunrise:
            0.64
    },


    // ========================================================
    // ESCENA 12
    // ========================================================

    {
        text:
            "Porque no quiero imaginar mi vida sin ti, sin tus momentos, sin tus abrazos, sin todo eso que hace que seas tú.",

        camera:
            {
                x: -2,
                y: 2.5,
                z: 5.5
            },

        look:
            {
                x: -0.5,
                y: 1,
                z: -1.5
            },

        duration:
            6500,

        sunrise:
            0.70
    },


    // ========================================================
    // ESCENA 13
    // ========================================================

    {
        text:
            "Sé que no soy perfecto y sé que todavía tengo muchas cosas que aprender y mejorar...",

        camera:
            {
                x: 2,
                y: 3.2,
                z: 6
            },

        look:
            {
                x: 0.5,
                y: 1,
                z: -1
            },

        duration:
            5500,

        sunrise:
            0.76
    },


    // ========================================================
    // ESCENA 14
    // ========================================================

    {
        text:
            "pero quiero que sepas que mi amor por ti es algo que llevo muy dentro de mí.",

        camera:
            {
                x: 0,
                y: 3.5,
                z: 7
            },

        look:
            {
                x: 0,
                y: 1,
                z: 0
            },

        duration:
            6000,

        sunrise:
            0.82
    },


    // ========================================================
    // ESCENA 15
    // ========================================================

    {
        text:
            "Estas flores son solo un pequeño detalle...",

        camera:
            {
                x: -3.5,
                y: 3.8,
                z: 7
            },

        look:
            {
                x: -1,
                y: 1,
                z: -1
            },

        duration:
            4500,

        sunrise:
            0.86
    },


    // ========================================================
    // ESCENA 16
    // ========================================================

    {
        text:
            "Porque si pudiera regalarte algo que realmente representara lo que siento por ti, tendría que regalarte un pedacito de mi corazón.",

        camera:
            {
                x: 2.5,
                y: 4,
                z: 8
            },

        look:
            {
                x: 0,
                y: 1,
                z: 0
            },

        duration:
            7000,

        sunrise:
            0.90
    },


    // ========================================================
    // ESCENA 17
    // ========================================================

    {
        text:
            "Te amo demasiado, mi amor. ❤️",

        camera:
            {
                x: 0,
                y: 4.5,
                z: 9
            },

        look:
            {
                x: 0,
                y: 1,
                z: 0
            },

        duration:
            5500,

        sunrise:
            0.94,

        love:
            true
    },


    // ========================================================
    // ESCENA 18
    // ========================================================

    {
        text:
            "Feliz mes de las flores amarillas, mi amor.",

        camera:
            {
                x: -2,
                y: 5,
                z: 10
            },

        look:
            {
                x: 0,
                y: 0.8,
                z: 0
            },

        duration:
            5000,

        sunrise:
            0.96
    },


    // ========================================================
    // ESCENA 19
    // ========================================================

    {
        text:
            "No te regalo estas flores porque sean amarillas...",

        camera:
            {
                x: 2,
                y: 5.5,
                z: 11
            },

        look:
            {
                x: 0,
                y: 0.8,
                z: 0
            },

        duration:
            5000,

        sunrise:
            0.975
    },


    // ========================================================
    // ESCENA 20
    // ========================================================

    {
        text:
            "te las regalo porque quería encontrar una forma de decirte que te amo. 🌻",

        camera:
            {
                x: 0,
                y: 6,
                z: 12
            },

        look:
            {
                x: 0,
                y: 0.5,
                z: 0
            },

        duration:
            6500,

        sunrise:
            0.99
    },


    // ========================================================
    // ESCENA 21
    // ========================================================

    {
        text:
            "Y cuando algún día mires hacia adelante y no sepas qué camino tomar... recuerda que nunca estás sola.",

        camera:
            {
                x: 0,
                y: 6.5,
                z: 13
            },

        look:
            {
                x: 0,
                y: 0.5,
                z: 0
            },

        duration:
            7000,

        sunrise:
            1.0
    },


    // ========================================================
    // ESCENA 22
    // ========================================================

    {
        text:
            "Nunca olvides que, esté donde esté, yo estoy caminando contigo. Viendo contigo. Sintiendo contigo. A tu lado, incluso cuando no puedas verme.",

        camera:
            {
                x: 0,
                y: 7,
                z: 14
            },

        look:
            {
                x: 0,
                y: 0,
                z: 0
            },

        duration:
            8500,

        sunrise:
            1.0
    },


    // ========================================================
    // CIERRE
    // ========================================================

    {
        text:
            "A donde quiera que vayas... quiero seguir caminando a tu lado. ❤️",

        camera:
            {
                x: 0,
                y: 7.5,
                z: 15
            },

        look:
            {
                x: 0,
                y: 0,
                z: 0
            },

        duration:
            10000,

        sunrise:
            1.0,

        love:
            true
    }
];


// ============================================================
// ÍNDICE DE LA SECUENCIA
// ============================================================

let cinematicIndex =
    0;


// ============================================================
// PROGRAMAR SIGUIENTE ESCENA
// ============================================================
//
// Esta función existía cuando la carta avanzaba
// automáticamente.
//
// Ahora la experiencia es interactiva:
//
//      TEXTO
//        ↓
//      LA PERSONA LEE
//        ↓
//      TAP
//        ↓
//      TRANSICIÓN
//
// Por eso ya no utilizamos temporizadores aquí.
//
// ============================================================

function scheduleNextCinematicScene() {

    // La siguiente escena comenzará mediante TAP.
}


// ============================================================
// COMENZAR TRANSICIÓN CINEMATOGRÁFICA
// ============================================================

function startCinematicTransition() {

    // ========================================================
    // COMPROBAR SI TERMINAMOS LA CARTA
    // ========================================================

    if (
        cinematicIndex >=
        cinematicScenes.length
    ) {

        startFinalScene();

        return;
    }


    // ========================================================
    // BLOQUEAR NUEVOS TAPS
    // ========================================================

    interactionLocked =
        true;


    // ========================================================
    // CAMBIAR ESTADO
    // ========================================================

    state =
        STATES.CINEMATIC_TRANSITION;

    stateTime =
        0;


    // ========================================================
    // OCULTAR TEXTO ANTERIOR
    // ========================================================

    introSubtitle.style.opacity =
        "0";
}


// ============================================================
// PREPARAR ESCENA CINEMATOGRÁFICA
// ============================================================

function prepareCinematicScene() {

    const sceneData =
        cinematicScenes[
            cinematicIndex
        ];


    // --------------------------------------------------------
    // Texto
    // --------------------------------------------------------

    introSubtitle.textContent =
        sceneData.text;


    // --------------------------------------------------------
    // Mostrar texto
    // --------------------------------------------------------

    introSubtitle.style.opacity =
        "1";


    // --------------------------------------------------------
    // Amanecer
    // --------------------------------------------------------

    setSunriseProgress(
        sceneData.sunrise
    );


    // --------------------------------------------------------
    // Texto especial de amor
    // --------------------------------------------------------

    if (
        sceneData.love
    ) {

        introSubtitle.style.color =
            "#ffd6d6";

        introSubtitle.style.textShadow =
            "0 0 15px rgba(255,80,80,0.35), 0 0 35px rgba(255,120,120,0.20)";

        introSubtitle.style.transform =
            "scale(1.05)";
    }

    else {

        introSubtitle.style.color =
            "";

        introSubtitle.style.textShadow =
            "";

        introSubtitle.style.transform =
            "";
    }
}


// ============================================================
// ANIMAR TRANSICIÓN CINEMATOGRÁFICA
// ============================================================
//
// Cada transición comienza desde la posición exacta donde
// terminó la escena anterior.
//
// Esto permite que el recorrido continúe de manera natural.
//
// ============================================================

function animateCinematicTransition(
    elapsedTime
) {

    const sceneData =
        cinematicScenes[
            cinematicIndex
        ];


    // --------------------------------------------------------
    // Duración de la transición de cámara.
    //
    // Este valor controla solamente cuánto tarda
    // la cámara en desplazarse.
    //
    // NO controla cuánto tiempo permanece visible
    // el texto.
    // --------------------------------------------------------

    const duration =
        3.8;

    const progress =
        Math.min(
            elapsedTime / duration,
            1
        );

    const smooth =
        easeInOutCubic(
            progress
        );


    // ========================================================
    // POSICIÓN ACTUAL
    // ========================================================

    /*
     * La cámara parte desde donde terminó
     * la escena anterior.
     */

    const targetCamera =
        sceneData.camera;

    const targetLook =
        sceneData.look;


    // --------------------------------------------------------
    // Guardar posición inicial solamente al comenzar.
    // --------------------------------------------------------

    if (
        !sceneData.startCamera
    ) {

        sceneData.startCamera = {

            x:
                camera.position.x,

            y:
                camera.position.y,

            z:
                camera.position.z
        };


        sceneData.startLook = {

            x:
                0,

            y:
                1,

            z:
                0
        };
    }


    // ========================================================
    // MOVIMIENTO DE CÁMARA
    // ========================================================

    camera.position.x =
        THREE.MathUtils.lerp(
            sceneData.startCamera.x,
            targetCamera.x,
            smooth
        );

    camera.position.y =
        THREE.MathUtils.lerp(
            sceneData.startCamera.y,
            targetCamera.y,
            smooth
        );

    camera.position.z =
        THREE.MathUtils.lerp(
            sceneData.startCamera.z,
            targetCamera.z,
            smooth
        );


    // ========================================================
    // MIRADA
    // ========================================================

    camera.lookAt(
        targetLook.x,
        targetLook.y,
        targetLook.z
    );


    // ========================================================
    // JARDÍN
    // ========================================================

    animateGarden(
        performance.now() / 1000
    );


    // ========================================================
    // LUZ
    // ========================================================

    const currentSunrise =
        THREE.MathUtils.lerp(
            sunriseProgress,
            sceneData.sunrise,
            smooth
        );

    setSunriseProgress(
        currentSunrise
    );


    // ========================================================
    // FINAL DE LA TRANSICIÓN
    // ========================================================

    if (
        progress >= 1
    ) {

        state =
            STATES.CINEMATIC_SCENE;

        stateTime =
            0;


        // ----------------------------------------------------
        // La persona controla cuándo continuar.
        // ----------------------------------------------------

        interactionLocked =
            false;


        // ----------------------------------------------------
        // Mostrar el nuevo mensaje.
        // ----------------------------------------------------

        prepareCinematicScene();
    }
}


// ============================================================
// TERMINAR ESCENA CINEMATOGRÁFICA
// ============================================================
//
// Esta función ahora es llamada mediante TAP.
//
// La persona lee el mensaje y cuando termina:
//
//      TAP
//
// entonces pasamos a la siguiente transición.
//
// ============================================================

function finishCinematicScene() {

    // ========================================================
    // SEGURIDAD
    // ========================================================

    if (
        state !==
        STATES.CINEMATIC_SCENE
    ) {

        return;
    }


    // ========================================================
    // ESCENA ACTUAL
    // ========================================================

    const sceneData =
        cinematicScenes[
            cinematicIndex
        ];


    // ========================================================
    // LIMPIAR POSICIÓN INICIAL
    // ========================================================

    /*
     * La siguiente transición debe guardar
     * nuevamente desde dónde empieza.
     */

    delete sceneData.startCamera;
    delete sceneData.startLook;


    // ========================================================
    // AVANZAR ÍNDICE
    // ========================================================

    cinematicIndex++;


    // ========================================================
    // COMPROBAR SI TERMINAMOS TODA LA CARTA
    // ========================================================

    if (
        cinematicIndex >=
        cinematicScenes.length
    ) {

        startFinalScene();

        return;
    }


    // ========================================================
    // PREPARAR SIGUIENTE TRANSICIÓN
    // ========================================================

    /*
     * Utilizamos SECOND_GARDEN como estado de espera.
     *
     * Cuando la persona toque:
     *
     * - Si estamos en la primera escena:
     *       DAWN_TRANSITION
     *
     * - Si ya estamos dentro de la secuencia:
     *       CINEMATIC_TRANSITION
     *
     * De esta manera no repetimos la transición
     * especial del amanecer.
     */

    state =
        STATES.SECOND_GARDEN;

    interactionLocked =
        false;
}


// ============================================================
// ESCENA FINAL
// ============================================================
//
// El jardín permanece completamente visible.
//
// No desaparecen las flores.
//
// La cámara termina elevada mostrando todo el jardín.
//
// ============================================================

function startFinalScene() {

    state =
        STATES.FINAL;

    interactionLocked =
        true;


    // --------------------------------------------------------
    // Amanecer completo.
    // --------------------------------------------------------

    setSunriseProgress(
        1
    );


    introSubtitle.style.opacity =
        "0";


    // --------------------------------------------------------
    // Última cámara.
    // --------------------------------------------------------

    camera.position.set(
        0,
        7.5,
        15
    );

    camera.lookAt(
        0,
        0,
        0
    );


    // --------------------------------------------------------
    // Último texto.
    // --------------------------------------------------------

    setTimeout(() => {

        introSubtitle.textContent =
            "A donde quiera que vayas... quiero seguir caminando a tu lado. ❤️";

        introSubtitle.style.color =
            "#ffd6d6";

        introSubtitle.style.textShadow =
            "0 0 15px rgba(255,80,80,0.35), 0 0 40px rgba(255,120,120,0.25)";

        introSubtitle.style.opacity =
            "1";

    }, 1000);
}


// ============================================================
// ANIMAR JARDÍN
// ============================================================

function animateGarden(
    elapsedTime
) {

    const flowers =
        garden.userData.flowers;


    flowers.forEach(
        flower => {

            const data =
                flower.userData;


            // ------------------------------------------------
            // VIENTO
            // ------------------------------------------------

            const wind =
                Math.sin(
                    elapsedTime *
                        data.swaySpeed +
                    data.animationOffset
                );

            flower.rotation.z =
                wind *
                data.swayAmount;


            // ------------------------------------------------
            // BRILLO
            // ------------------------------------------------

            if (
                data.glow
            ) {

                const pulse =
                    1 +
                    Math.sin(
                        elapsedTime *
                            1.5 +
                        data.animationOffset
                    ) *
                    0.08;

                data.glow.scale.set(
                    pulse,
                    pulse,
                    pulse
                );
            }


            // ------------------------------------------------
            // HOJAS
            // ------------------------------------------------

            if (
                data.leftLeaf
            ) {

                data.leftLeaf.rotation.y =
                    -0.25 +
                    wind * 0.04;
            }


            if (
                data.rightLeaf
            ) {

                data.rightLeaf.rotation.y =
                    0.25 +
                    wind * 0.04;
            }
        }
    );


    // ========================================================
    // BRILLOS DEL SUELO
    // ========================================================

    garden.children.forEach(
        child => {

            if (
                child.userData &&
                child.userData.baseY !==
                    undefined
            ) {

                child.position.y =
                    child.userData.baseY +
                    Math.sin(
                        elapsedTime *
                            1.4 +
                        child.userData
                            .animationOffset
                    ) *
                    0.05;
            }
        }
    );
}


// ============================================================
// ANIMAR FLOR PRINCIPAL
// ============================================================

function animateMainFlower(
    elapsedTime
) {

    if (
        !mainFlower.visible
    ) {

        return;
    }


    const data =
        mainFlower.userData;


    // ========================================================
    // RESPIRACIÓN
    // ========================================================

    const breathing =
        1 +
        Math.sin(
            elapsedTime * 1.2
        ) *
        0.015;


    if (
        state === STATES.INTRO ||
        state === STATES.FLOWER_AWAKENING
    ) {

        mainFlower.scale.set(
            breathing,
            breathing,
            breathing
        );
    }


    // ========================================================
    // HOJAS
    // ========================================================

    if (
        data.leftLeaf
    ) {

        data.leftLeaf.rotation.y =
            -0.25 +
            Math.sin(
                elapsedTime * 0.9
            ) *
            0.03;
    }


    if (
        data.rightLeaf
    ) {

        data.rightLeaf.rotation.y =
            0.25 +
            Math.sin(
                elapsedTime * 0.9 +
                1
            ) *
            0.03;
    }


    // ========================================================
    // BRILLO
    // ========================================================

    if (
        data.glow
    ) {

        const pulse =
            1 +
            Math.sin(
                elapsedTime * 1.5
            ) *
            0.08;

        data.glow.scale.set(
            pulse,
            pulse,
            pulse
        );
    }


    // ========================================================
    // LUZ DE LA FLOR
    // ========================================================

    if (
        data.light
    ) {

        data.light.intensity =
            0.35 +
            Math.sin(
                elapsedTime * 1.5
            ) *
            0.04;
    }
}


// ============================================================
// EASE IN / OUT
// ============================================================

function easeInOutCubic(
    value
) {

    return value < 0.5

        ? 4 *
            value *
            value *
            value

        : 1 -
            Math.pow(
                -2 * value + 2,
                3
            ) /
            2;
}


// ============================================================
// EASE OUT BACK
// ============================================================

function easeOutBack(
    value
) {

    const c1 =
        1.70158;

    const c3 =
        c1 + 1;


    return (
        1 +
        c3 *
            Math.pow(
                value - 1,
                3
            ) +
        c1 *
            Math.pow(
                value - 1,
                2
            )
    );
}


// ============================================================
// RESIZE
// ============================================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );
    }
);


// ============================================================
// LOOP PRINCIPAL
// ============================================================

function animate() {

    requestAnimationFrame(
        animate
    );


    // ========================================================
    // TIEMPO
    // ========================================================

    const currentTime =
        performance.now();

    const deltaTime =
        Math.min(
            (
                currentTime -
                previousTime
            ) / 1000,
            0.1
        );

    previousTime =
        currentTime;

    const elapsedTime =
        currentTime / 1000;


    // ========================================================
    // PARTÍCULAS
    // ========================================================

    animateParticles(
        magicParticles,
        elapsedTime,
        deltaTime
    );


    // ========================================================
    // FLOR
    // ========================================================

    animateMainFlower(
        elapsedTime
    );


    // ========================================================
    // CIELO
    // ========================================================

    if (
        sky.visible
    ) {

        animateSky(
            sky,
            elapsedTime,
            deltaTime
        );
    }


    // ========================================================
    // TRANSICIÓN FLOR → JARDÍN
    // ========================================================

    if (
        state ===
        STATES.GARDEN_TRANSITION
    ) {

        stateTime +=
            deltaTime;

        animateGardenTransition(
            stateTime
        );
    }


    // ========================================================
    // JARDÍN
    // ========================================================

    if (
        state === STATES.GARDEN ||
        state === STATES.SECOND_GARDEN
    ) {

        animateGarden(
            elapsedTime
        );
    }


    // ========================================================
    // SEGUNDA TRANSICIÓN
    // ========================================================

    if (
        state ===
        STATES.SECOND_GARDEN_TRANSITION
    ) {

        stateTime +=
            deltaTime;

        animateSecondGardenTransition(
            stateTime
        );
    }


    // ========================================================
    // TRANSICIÓN DE AMANECER
    // ========================================================

    if (
        state ===
        STATES.DAWN_TRANSITION
    ) {

        stateTime +=
            deltaTime;

        animateDawnTransition(
            stateTime
        );
    }


    // ========================================================
    // NUEVA TRANSICIÓN DEL RECORRIDO ROMÁNTICO
    // ========================================================
    //
    // Esta transición conecta:
    //
    // "Hay algo que quiero decirte..."
    //
    // con:
    //
    // "A pesar de todos mis errores..."
    //
    // La cámara se adentra en el jardín manteniendo
    // la continuidad del recorrido.
    //
    // ========================================================

    if (
        state ===
        STATES.LOVE_JOURNEY_TRANSITION
    ) {

        stateTime +=
            deltaTime;

        animateLoveJourneyTransition(
            stateTime
        );
    }


    // ========================================================
    // TRANSICIONES CINEMATOGRÁFICAS
    // ========================================================

    if (
        state ===
        STATES.CINEMATIC_TRANSITION
    ) {

        stateTime +=
            deltaTime;

        animateCinematicTransition(
            stateTime
        );
    }


    // ========================================================
    // ESCENAS CINEMATOGRÁFICAS
    // ========================================================

    if (
        state ===
        STATES.CINEMATIC_SCENE
    ) {

        /*
         * Mientras la persona lee,
         * el jardín continúa vivo.
         */

        animateGarden(
            elapsedTime
        );
    }


    // ========================================================
    // ESCENA FINAL
    // ========================================================

    if (
        state ===
        STATES.FINAL
    ) {

        animateGarden(
            elapsedTime
        );


        // ----------------------------------------------------
        // El amanecer permanece completo.
        // ----------------------------------------------------

        setSunriseProgress(
            1
        );
    }


    // ========================================================
    // RENDER
    // ========================================================

    renderer.render(
        scene,
        camera
    );
}


// ============================================================
// INICIAR EXPERIENCIA
// ============================================================

animate();