let scene, camera, renderer;
const images = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
    // 더 많은 이미지를 추가할 수 있습니다.
];

function init() {
    // 씬 설정
    scene = new THREE.Scene();

    // 카메라 설정
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // 렌더러 설정
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // 이미지를 3D 오브젝트로 추가
    const textureLoader = new THREE.TextureLoader();
    images.forEach((image, index) => {
        textureLoader.load(image, function(texture) {
            const geometry = new THREE.PlaneGeometry(2, 2);
            const material = new THREE.MeshBasicMaterial({ map: texture });
            const mesh = new THREE.Mesh(geometry, material);

            // 3D 공간에 이미지 배치 (예: 원형으로 배치)
            const angle = (index / images.length) * Math.PI * 2;
            mesh.position.x = Math.cos(angle) * 5;
            mesh.position.z = Math.sin(angle) * 5;

            scene.add(mesh);
        });
    });

    // 애니메이션 루프 시작
    animate();

    // 이벤트 리스너 추가
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
}

// 창 크기 조정 시 카메라와 렌더러 업데이트
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 마우스 움직임에 반응하여 카메라 회전
function onDocumentMouseMove(event) {
    event.preventDefault();
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    camera.position.x = mouseX * 10;
    camera.position.y = mouseY * 10;
    camera.lookAt(scene.position);
}

// 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// 초기화 함수 호출
init();
