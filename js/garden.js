// ============================================================
// GARDEN.JS
// ============================================================
//
// Este archivo construye el jardín completo.
//
// En esta versión damos un paso importante:
//
// El jardín ya no será simplemente:
//
//      [círculo oscuro] + [flores]
//
// Ahora queremos crear:
//
//      🌿 suelo
//      🌱 hierba
//      🍃 vegetación
//      🪨 pequeños detalles
//      ✨ luces
//      🌻 flores
//
// Todo con una filosofía:
//
// "Mucho detalle visual, pocos objetos 3D reales."
//
// Esto es especialmente importante porque la experiencia está
// pensada para ejecutarse principalmente en celulares.
//
// ============================================================

import * as THREE from "three";


// ============================================================
// CONFIGURACIÓN DEL JARDÍN
// ============================================================

const FLOWER_COUNT = 55;

const GARDEN_RADIUS = 9;

const MIN_FLOWER_SCALE = 0.55;
const MAX_FLOWER_SCALE = 1.35;


// ============================================================
// CONFIGURACIÓN DE FLORES
// ============================================================

const OUTER_PETAL_COUNT = 14;
const INNER_PETAL_COUNT = 8;


// ============================================================
// CONFIGURACIÓN DE VEGETACIÓN
// ============================================================
//
// Estas cantidades parecen grandes, pero utilizaremos
// InstancedMesh.
//
// Eso significa que, aunque visualmente tendremos muchas
// briznas de hierba, Three.js no tendrá que administrar cientos
// de objetos independientes.
//
// ============================================================

const GRASS_COUNT = 260;

const SMALL_GRASS_COUNT = 120;

const ROCK_COUNT = 24;


// ============================================================
// GEOMETRÍAS Y MATERIALES COMPARTIDOS
// ============================================================
//
// Reutilizamos recursos.
//
// Esta es una de las claves del buen rendimiento.
//
// ============================================================


// ============================================================
// FLOR - TALLO
// ============================================================

const stemGeometry = new THREE.CylinderGeometry(
    0.045,
    0.065,
    1.55,
    10
);

const stemMaterial = new THREE.MeshStandardMaterial({
    color: 0x315c32,
    roughness: 0.85,
    metalness: 0
});


// ============================================================
// FLOR - HOJAS
// ============================================================

const leafGeometry = new THREE.SphereGeometry(
    0.30,
    12,
    8
);

const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0x356b38,
    roughness: 0.82,
    metalness: 0
});


// ============================================================
// FLOR - CENTRO
// ============================================================

const centerGeometry = new THREE.SphereGeometry(
    0.25,
    16,
    10
);

const centerMaterial = new THREE.MeshStandardMaterial({
    color: 0x6b4218,
    roughness: 0.78,
    metalness: 0
});


// ============================================================
// FLOR - PÉTALOS EXTERIORES
// ============================================================

const outerPetalGeometry = new THREE.SphereGeometry(
    0.30,
    14,
    9
);

const outerPetalMaterials = [

    new THREE.MeshStandardMaterial({
        color: 0xffd83d,
        roughness: 0.55,
        metalness: 0.05
    }),

    new THREE.MeshStandardMaterial({
        color: 0xffdf55,
        roughness: 0.55,
        metalness: 0.05
    }),

    new THREE.MeshStandardMaterial({
        color: 0xffc928,
        roughness: 0.55,
        metalness: 0.05
    }),

    new THREE.MeshStandardMaterial({
        color: 0xffe36b,
        roughness: 0.55,
        metalness: 0.05
    })
];


// ============================================================
// FLOR - PÉTALOS INTERIORES
// ============================================================

const innerPetalGeometry = new THREE.SphereGeometry(
    0.24,
    12,
    8
);

const innerPetalMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xffd447,
        roughness: 0.58,
        metalness: 0
    });


// ============================================================
// FLOR - GLOW
// ============================================================

const flowerGlowGeometry =
    new THREE.SphereGeometry(
        0.62,
        12,
        8
    );

const flowerGlowMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xffd75a,
        transparent: true,
        opacity: 0.035,
        depthWrite: false
    });


// ============================================================
// HIERBA GRANDE
// ============================================================
//
// Creamos una pequeña "hoja" triangular.
//
// Después utilizaremos InstancedMesh para repetirla cientos
// de veces.
//
// ============================================================

const grassGeometry =
    new THREE.ConeGeometry(
        0.035,
        0.45,
        4
    );

const grassMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x244827,
        roughness: 1,
        metalness: 0
    });


// ============================================================
// HIERBA PEQUEÑA
// ============================================================

const smallGrassGeometry =
    new THREE.ConeGeometry(
        0.025,
        0.25,
        4
    );

const smallGrassMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x315d32,
        roughness: 1,
        metalness: 0
    });


// ============================================================
// PIEDRAS
// ============================================================

const rockGeometry =
    new THREE.DodecahedronGeometry(
        0.10,
        0
    );

const rockMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x253027,
        roughness: 0.95,
        metalness: 0
    });


// ============================================================
// FUNCIÓN AUXILIAR
// ============================================================
//
// Genera una posición aleatoria dentro del jardín.
//
// Utilizamos distribución radial para que las posiciones
// naturales no formen patrones evidentes.
//
// ============================================================

function getRandomGardenPosition(radius = GARDEN_RADIUS) {

    const angle =
        Math.random() *
        Math.PI *
        2;

    const distance =
        Math.sqrt(Math.random()) *
        radius;

    return {
        x: Math.cos(angle) * distance,
        z: Math.sin(angle) * distance
    };
}


// ============================================================
// CREAR FLOR OPTIMIZADA
// ============================================================
//
// Esta NO reemplaza la flor protagonista.
//
// La flor principal continúa utilizando flower.js.
//
// Esta versión existe exclusivamente para el jardín.
//
// ============================================================

function createOptimizedFlower() {

    const flower =
        new THREE.Group();


    // --------------------------------------------------------
    // ALTURA DEL TALLO
    // --------------------------------------------------------

    const stemHeight =
        1.25 +
        Math.random() * 0.45;


    // --------------------------------------------------------
    // TALLO
    // --------------------------------------------------------

    const stem =
        new THREE.Mesh(
            stemGeometry,
            stemMaterial
        );

    stem.scale.y =
        stemHeight / 1.55;

    stem.position.y =
        stemHeight / 2;

    stem.rotation.z =
        -0.035;

    flower.add(stem);


    // --------------------------------------------------------
    // HOJA IZQUIERDA
    // --------------------------------------------------------

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
        stemHeight * 0.45,
        0
    );

    leftLeaf.rotation.z =
        -0.35;

    leftLeaf.rotation.y =
        -0.25;

    flower.add(leftLeaf);


    // --------------------------------------------------------
    // HOJA DERECHA
    // --------------------------------------------------------

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
        stemHeight * 0.62,
        0
    );

    rightLeaf.rotation.z =
        0.35;

    rightLeaf.rotation.y =
        0.25;

    flower.add(rightLeaf);


    // --------------------------------------------------------
    // ALTURA DEL CENTRO
    // --------------------------------------------------------

    const flowerCenterY =
        stemHeight + 0.05;


    // ========================================================
    // PÉTALOS EXTERIORES
    // ========================================================

    for (
        let i = 0;
        i < OUTER_PETAL_COUNT;
        i++
    ) {

        const angle =
            (i / OUTER_PETAL_COUNT) *
            Math.PI *
            2;

        const material =
            outerPetalMaterials[
                i % outerPetalMaterials.length
            ];

        const petal =
            new THREE.Mesh(
                outerPetalGeometry,
                material
            );

        petal.scale.set(
            0.55,
            1.25,
            0.18
        );

        const radius = 0.39;

        petal.position.x =
            Math.cos(angle) *
            radius;

        petal.position.z =
            Math.sin(angle) *
            radius;

        petal.position.y =
            flowerCenterY;

        petal.rotation.y =
            -angle;

        petal.rotation.x =
            0.12;

        flower.add(petal);
    }


    // ========================================================
    // PÉTALOS INTERIORES
    // ========================================================

    for (
        let i = 0;
        i < INNER_PETAL_COUNT;
        i++
    ) {

        const angle =
            (i / INNER_PETAL_COUNT) *
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

        const radius = 0.27;

        petal.position.x =
            Math.cos(angle) *
            radius;

        petal.position.z =
            Math.sin(angle) *
            radius;

        petal.position.y =
            flowerCenterY + 0.01;

        petal.rotation.y =
            -angle;

        petal.rotation.x =
            0.08;

        flower.add(petal);
    }


    // ========================================================
    // CENTRO
    // ========================================================

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
        flowerCenterY;

    flower.add(center);


    // ========================================================
    // GLOW
    // ========================================================

    const glow =
        new THREE.Mesh(
            flowerGlowGeometry,
            flowerGlowMaterial
        );

    glow.position.y =
        flowerCenterY;

    flower.add(glow);


    // ========================================================
    // DATOS PARA MAIN.JS
    // ========================================================

    flower.userData.gardenFlower =
        true;

    flower.userData.baseScale =
        1;

    flower.userData.animationOffset =
        Math.random() *
        Math.PI *
        2;

    flower.userData.swaySpeed =
        0.8 +
        Math.random() * 0.7;

    flower.userData.swayAmount =
        0.015 +
        Math.random() * 0.025;

    flower.userData.center =
        center;

    flower.userData.glow =
        glow;

    flower.userData.leftLeaf =
        leftLeaf;

    flower.userData.rightLeaf =
        rightLeaf;


    return flower;
}


// ============================================================
// CREAR HIERBA INSTANCIADA
// ============================================================
//
// Aquí aparece una de las optimizaciones más importantes.
//
// En lugar de:
//
//      260 objetos de hierba
//
// tenemos:
//
//      1 InstancedMesh
//
// que dibuja las 260 instancias.
//
// Visualmente tendremos mucha hierba.
//
// Internamente será muchísimo más eficiente.
//
// ============================================================

function createGrass() {

    const grass =
        new THREE.InstancedMesh(
            grassGeometry,
            grassMaterial,
            GRASS_COUNT
        );


    const matrix =
        new THREE.Matrix4();


    const position =
        new THREE.Vector3();

    const rotation =
        new THREE.Euler();

    const scale =
        new THREE.Vector3();


    for (
        let i = 0;
        i < GRASS_COUNT;
        i++
    ) {

        const point =
            getRandomGardenPosition(
                GARDEN_RADIUS + 1
            );


        position.set(
            point.x,
            0.22,
            point.z
        );


        rotation.set(
            0,
            Math.random() * Math.PI,
            (Math.random() - 0.5) * 0.25
        );


        const randomScale =
            0.55 +
            Math.random() * 1.3;


        scale.set(
            randomScale,
            randomScale,
            randomScale
        );


        matrix.compose(
            position,
            new THREE.Quaternion()
                .setFromEuler(rotation),
            scale
        );


        grass.setMatrixAt(
            i,
            matrix
        );
    }


    grass.instanceMatrix.needsUpdate =
        true;


    return grass;
}


// ============================================================
// CREAR HIERBA PEQUEÑA
// ============================================================

function createSmallGrass() {

    const grass =
        new THREE.InstancedMesh(
            smallGrassGeometry,
            smallGrassMaterial,
            SMALL_GRASS_COUNT
        );


    const matrix =
        new THREE.Matrix4();


    const position =
        new THREE.Vector3();

    const rotation =
        new THREE.Euler();

    const scale =
        new THREE.Vector3();


    for (
        let i = 0;
        i < SMALL_GRASS_COUNT;
        i++
    ) {

        const point =
            getRandomGardenPosition(
                GARDEN_RADIUS + 1.5
            );


        position.set(
            point.x,
            0.12,
            point.z
        );


        rotation.set(
            0,
            Math.random() *
            Math.PI *
            2,
            0
        );


        const randomScale =
            0.6 +
            Math.random() * 1.2;


        scale.set(
            randomScale,
            randomScale,
            randomScale
        );


        matrix.compose(
            position,
            new THREE.Quaternion()
                .setFromEuler(rotation),
            scale
        );


        grass.setMatrixAt(
            i,
            matrix
        );
    }


    grass.instanceMatrix.needsUpdate =
        true;


    return grass;
}


// ============================================================
// CREAR PIEDRAS
// ============================================================
//
// Las piedras son pequeñas.
//
// Su objetivo no es llamar la atención.
//
// Simplemente ayudan a romper la sensación de "suelo vacío".
//
// ============================================================

function createRocks() {

    const rocks =
        new THREE.InstancedMesh(
            rockGeometry,
            rockMaterial,
            ROCK_COUNT
        );


    const matrix =
        new THREE.Matrix4();


    const position =
        new THREE.Vector3();

    const rotation =
        new THREE.Euler();

    const scale =
        new THREE.Vector3();


    for (
        let i = 0;
        i < ROCK_COUNT;
        i++
    ) {

        const point =
            getRandomGardenPosition(
                GARDEN_RADIUS + 1
            );


        position.set(
            point.x,
            0.07,
            point.z
        );


        rotation.set(
            Math.random() * 0.4,
            Math.random() * Math.PI * 2,
            Math.random() * 0.4
        );


        const randomScale =
            0.5 +
            Math.random() * 1.2;


        scale.set(
            randomScale * 1.3,
            randomScale * 0.65,
            randomScale
        );


        matrix.compose(
            position,
            new THREE.Quaternion()
                .setFromEuler(rotation),
            scale
        );


        rocks.setMatrixAt(
            i,
            matrix
        );
    }


    rocks.instanceMatrix.needsUpdate =
        true;


    return rocks;
}


// ============================================================
// FUNCIÓN PRINCIPAL
// ============================================================

export function createGarden() {

    // --------------------------------------------------------
    // GRUPO PRINCIPAL
    // --------------------------------------------------------

    const garden =
        new THREE.Group();


    // ========================================================
    // SUELO
    // ========================================================
    //
    // Antes era casi negro.
    //
    // Ahora utilizamos un verde nocturno.
    //
    // No buscamos un verde brillante.
    //
    // Queremos que parezca un campo bajo la luz de la noche.
    //
    // ========================================================

    const groundGeometry =
        new THREE.CircleGeometry(
            GARDEN_RADIUS + 3,
            64
        );


    const groundMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x102116,
            roughness: 1,
            metalness: 0
        });


    const ground =
        new THREE.Mesh(
            groundGeometry,
            groundMaterial
        );


    ground.rotation.x =
        -Math.PI / 2;


    ground.position.y =
        -0.015;


    garden.add(ground);


    // ========================================================
    // VEGETACIÓN
    // ========================================================
    //
    // Añadimos la hierba ANTES de las flores.
    //
    // Así las flores quedan visualmente integradas en el campo.
    // ========================================================

    const grass =
        createGrass();

    garden.add(grass);


    const smallGrass =
        createSmallGrass();

    garden.add(smallGrass);


    // ========================================================
    // PIEDRAS
    // ========================================================

    const rocks =
        createRocks();

    garden.add(rocks);


    // ========================================================
    // FLORES
    // ========================================================

    for (
        let i = 0;
        i < FLOWER_COUNT;
        i++
    ) {

        // ----------------------------------------------------
        // POSICIÓN
        // ----------------------------------------------------

        const point =
            getRandomGardenPosition();


        // ----------------------------------------------------
        // CREAR FLOR
        // ----------------------------------------------------

        const flower =
            createOptimizedFlower();


        // ----------------------------------------------------
        // TAMAÑO
        // ----------------------------------------------------

        const scale =
            THREE.MathUtils.lerp(
                MIN_FLOWER_SCALE,
                MAX_FLOWER_SCALE,
                Math.random()
            );


        flower.scale.setScalar(
            scale
        );


        // ----------------------------------------------------
        // POSICIÓN
        // ----------------------------------------------------

        flower.position.x =
            point.x;

        flower.position.z =
            point.z;


        flower.position.y =
            (Math.random() - 0.5) *
            0.08;


        // ----------------------------------------------------
        // ROTACIÓN
        // ----------------------------------------------------

        flower.rotation.y =
            Math.random() *
            Math.PI *
            2;


        // ----------------------------------------------------
        // ESCALA BASE
        // ----------------------------------------------------

        flower.userData.baseScale =
            scale;


        // ----------------------------------------------------
        // APARICIÓN
        // ----------------------------------------------------

        flower.scale.multiplyScalar(
            0.01
        );


        flower.userData.appearDelay =
            Math.random() *
            1.8;


        // ----------------------------------------------------
        // AÑADIR
        // ----------------------------------------------------

        garden.add(
            flower
        );
    }


    // ========================================================
    // LUCES DEL JARDÍN
    // ========================================================
    //
    // Conservamos solamente unas pocas PointLight.
    //
    // NO añadimos una luz por flor.
    //
    // ========================================================

    const gardenLightCount = 8;


    for (
        let i = 0;
        i < gardenLightCount;
        i++
    ) {

        const light =
            new THREE.PointLight(
                0xffd76a,
                0.18,
                5
            );


        const point =
            getRandomGardenPosition(
                GARDEN_RADIUS
            );


        light.position.x =
            point.x;


        light.position.z =
            point.z;


        light.position.y =
            0.5 +
            Math.random() * 1.2;


        garden.add(
            light
        );
    }


    // ========================================================
    // PEQUEÑOS PUNTOS DE LUZ
    // ========================================================

    const glowCount = 35;


    const glowGeometry =
        new THREE.SphereGeometry(
            0.025,
            8,
            8
        );


    const glowMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffd75a,
            transparent: true,
            opacity: 0.55,
            depthWrite: false
        });


    for (
        let i = 0;
        i < glowCount;
        i++
    ) {

        const glow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );


        const point =
            getRandomGardenPosition(
                GARDEN_RADIUS
            );


        glow.position.x =
            point.x;


        glow.position.z =
            point.z;


        glow.position.y =
            0.5 +
            Math.random() * 2.5;


        glow.userData.baseY =
            glow.position.y;


        glow.userData.animationOffset =
            Math.random() *
            Math.PI *
            2;


        glow.userData.floatSpeed =
            0.5 +
            Math.random() * 0.8;


        garden.add(
            glow
        );
    }


    // ========================================================
    // INFORMACIÓN PARA MAIN.JS
    // ========================================================

    garden.userData.isGarden =
        true;


    garden.userData.flowers =
        [];


    garden.children.forEach(
        (child) => {

            if (
                child.userData?.gardenFlower
            ) {

                garden.userData.flowers.push(
                    child
                );
            }
        }
    );


    // ========================================================
    // ESTADO INICIAL
    // ========================================================

    garden.visible =
        false;


    // ========================================================
    // DEVOLVER JARDÍN
    // ========================================================

    return garden;
}