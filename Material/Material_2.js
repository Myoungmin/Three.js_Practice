import * as Three from '../three.js/three.module.js';
import { OrbitControls } from '../three.js/OrbitControls.js'

class App {
    constructor() {
        // id가 webgl-container인 div요소를 얻어와서, 상수에 저장 
        const divContainer = document.querySelector("#webgl-container");
        // 얻어온 상수를 클래스 필드에 정의
        // 다른 메서드에서 참조할 수 있도록 필드에 정의한다.
        this._divContainer = divContainer;

        // 렌더러 생성, Three.js의 WebGLRenderer 클래스로 생성
        // antialias를 활성화 시키면 렌더링될 때 오브젝트들의 경계선이 계단 현상 없이 부드럽게 표현된다.
        const renderer = new Three.WebGLRenderer({ antialias: true });
        // window의 devicePixelRatio 속성을 얻어와 PixelRatio 설정
        // 디스플레이 설정의 배율값을 얻어온다.
        renderer.setPixelRatio(window.devicePixelRatio);
        // domElement를 자식으로 추가.
        // canvas 타입의 DOM 객체이다.
        // 문서 객체 모델(DOM, Document Object Model)은 XML이나 HTML 문서에 접근하기 위한 일종의 인터페이스.
        divContainer.appendChild(renderer.domElement);
        // 다른 메서드에서 참조할 수 있도록 필드에 정의한다.
        this._renderer = renderer;

        // Scene 객체 생성
        const scene = new Three.Scene();
        // 다른 메서드에서 참조할 수 있도록 필드에 정의한다.
        this._scene = scene;

        // 카메라 객체를 구성
        this._setupCamera();
        // 조명 설정
        this._setupLight();
        // 3D 모델 설정
        this._setupModel();
        // 마우스 컨트롤 설정
        this._setupControls();

        // 창 크기가 변경될 때 발생하는 이벤트인 onresize에 App 클래스의 resize 메서드를 연결한다.
        // this가 가리키는 객체가 이벤트 객체가 아닌 App클래스 객체가 되도록 하기 위해 bind로 설정한다.
        // onresize 이벤트가 필요한 이유는 렌더러와 카메라는 창 크기가 변경될 때마다 그 크기에 맞게 속성값을 재설정해줘야 한다.
        window.onresize = this.resize.bind(this);
        // onresize 이벤트와 상관없이 생성자에서 resize 메서드를 호출한다.
        // 렌더러와 카메라의 속성을 창크기에 맞게 설정해준다. 
        this.resize();

        // render 메서드를 requestAnimationFrame이라는 API에 넘겨줘서 호출해준다.
        // render 메서드 안에서 쓰이는 this가 App 클래스 객체를 가리키도록 하기 위해 bind 사용
        requestAnimationFrame(this.render.bind(this));
    }

    _setupCamera() {
        // 3D 그래픽을 출력할 영역 width, height 얻어오기
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        // 얻어온 크기를 바탕으로 Perspective 카메라 객체 생성
        const camera = new Three.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
        camera.position.z = 3;
        // 다른 메서드에서 참조할 수 있도록 필드에 정의한다.
        this._camera = camera;
    }

    _setupLight() {
        // 광원 색상 설정
        const color = 0xffffff;
        // 광원 세기 설정
        const intensity = 1;
        // 위 설정을 바탕으로 Directional 광원 객체 생성
        const light = new Three.DirectionalLight(color, intensity);
        // 광원 위치 설정
        light.position.set(-1, 2, 4);
        // Scene객체에 광원 추가
        this._scene.add(light);
    }

    ////////////////////////////////////////////////////////////////////////////////////
    // // MeshBasicMaterial 사용하는 _setupModel 메서드
    // _setupModel() {
    //     // MeshBasicMaterial은 지정된 색상으로 렌더링한다.
    //     const material = new Three.MeshBasicMaterial({
    //         // Material을 상속받으므로 Material 속성을 설정할 수 있다.
    //         // 아래는 기본값 설정들
    //         visible: true,
    //         transparent: true,
    //         // transparent가 true일때만 적용되는 값, 값이 작아질수록 투명해진다.
    //         opacity: 0.5,
    //         // 픽셀을 깊이버퍼로 검사할지 여부
    //         depthTest: true,
    //         // 렌더링 되는 Mesh에 픽셀에 대한 z값을 깊이버퍼에 기록할지 여부
    //         dapthWrite: true,
    //         // Mesh를 구성하는 삼각형 면에 대해 앞, 뒷면 렌더링 여부 결정
    //         // 기본은 Three.FrontSide로 설정되어 앞면만 렌더링된다.
    //         side: Three.FrontSide,

    //         color: 0xffff00,
    //         // Mesh를 선 형태로 렌더링 할지 여부
    //         wireframe: false,
    //     });
    //     ////////////////////////////////////////////////////////////////////////////////

    //     const box = new Three.Mesh(new Three.BoxGeometry(1, 1, 1), material);
    //     box.position.set(-1, 0, 0);
    //     this._scene.add(box);

    //     const sphere = new Three.Mesh(new Three.SphereGeometry(0.7, 32, 32), material);
    //     sphere.position.set(1, 0, 0);
    //     this._scene.add(sphere);
    // }
    ////////////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////////
    // // MeshLambertMaterial 사용하는 _setupModel 메서드
    // _setupModel() {
    //     // MeshLambertMaterial는 Mesh를 구성하는 정점에서 광원을 계산하는 Material이다.
    //     const material = new Three.MeshLambertMaterial({
    //         transparent: true,
    //         opacity: 0.5,
    //         side: Three.DoubleSide,

    //         color: "#d25383",
    //         // 다른 광원에 영향을 받지않는 Material 자체에서 방출하는 색상값
    //         // 기본값은 검정색으로 어떠한 색상도 방출하지 않는다.
    //         emissive: 0x555500,
    //         wireframe: false,
    //     })

    //     const box = new Three.Mesh(new Three.BoxGeometry(1, 1, 1), material);
    //     box.position.set(-1, 0, 0);
    //     this._scene.add(box);

    //     const sphere = new Three.Mesh(new Three.SphereGeometry(0.7, 32, 32), material);
    //     sphere.position.set(1, 0, 0);
    //     this._scene.add(sphere);
    // }
    ////////////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////////
    // // MeshPhongMaterial 사용하는 _setupModel 메서드
    // _setupModel() {
    //     // MeshPhongMaterial은 mesh가 렌더링되는 픽셀 단위로 광원의 영향을 계산하는 재질
    //     const material = new Three.MeshPhongMaterial({
    //         color: 0xff0000,
    //         // 다른 광원에 영향을 받지 않는 재질 자체에서 방출하는 색상 값
    //         emissive: 0x000000,
    //         // 광원에 의해 반사되는 색상으로 기본값은 연한 회색이다
    //         specular: 0xffff00,
    //         // 반사되는 정도
    //         shiness: 10,
    //         // 평평한 모양으로 렌더링
    //         flatShading: true,
    //         wireframe: false,
    //     })

    //     const box = new Three.Mesh(new Three.BoxGeometry(1, 1, 1), material);
    //     box.position.set(-1, 0, 0);
    //     this._scene.add(box);

    //     const sphere = new Three.Mesh(new Three.SphereGeometry(0.7, 32, 32), material);
    //     sphere.position.set(1, 0, 0);
    //     this._scene.add(sphere);
    // }
    ////////////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////////
    // // MeshStandardMaterial 사용하는 _setupModel 메서드
    // _setupModel() {
    //     // MeshStandardMaterial mesh가 렌더링되는 픽셀 단위로 광원의 영향을 계산하는 재질
    //     const material = new Three.MeshStandardMaterial({
    //         color: 0xff0000,
    //         // 다른 광원에 영향을 받지 않는 재질 자체에서 방출하는 색상 값
    //         emissive: 0x000000,
    //         // 0은 표면이 거울과 같은 상태
    //         roughness: 0.25,
    //         // roughness가 1이면 이 값이 커져도 금속의 느낌을 주기 힘들다
    //         metalness: 0.6,
    //         // 평평한 모양으로 렌더링
    //         flatShading: false,
    //         wireframe: false,
    //     })

    //     const box = new Three.Mesh(new Three.BoxGeometry(1, 1, 1), material);
    //     box.position.set(-1, 0, 0);
    //     this._scene.add(box);

    //     const sphere = new Three.Mesh(new Three.SphereGeometry(0.7, 32, 32), material);
    //     sphere.position.set(1, 0, 0);
    //     this._scene.add(sphere);
    // }
    ////////////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////////
    // MeshPhysicalMaterial 사용하는 _setupModel 메서드
    _setupModel() {
        // MeshPhysicalMaterial은 MeshStandardMaterial를 상속 받고 있는 보다 발전된 물리기반 렌더링 재질
        // 재질의 표면에 코팅 효과를 줄 수 있고 다른 재질처럼 단순 투명도 처리가 아닌 실제 유리 같은 효과를 표현할 수 있다.
        const material = new Three.MeshPhysicalMaterial({
            color: 0xff0000,
            // 다른 광원에 영향을 받지 않는 재질 자체에서 방출하는 색상 값
            emissive: 0x000000,
            // 0은 표면이 거울과 같은 상태
            roughness: 1,
            // roughness가 1이면 이 값이 커져도 금속의 느낌을 주기 힘들다
            metalness: 0,
            // 평평한 모양으로 렌더링
            flatShading: false,
            wireframe: false,

            // 0이면 mesh의 표면에 코팅이 전혀 안되어 있는 재질
            clearcoat: 0.5,
            // 코팅의 거친 정도
            clearcoatRoughness: 0,
        })

        const box = new Three.Mesh(new Three.BoxGeometry(1, 1, 1), material);
        box.position.set(-1, 0, 0);
        this._scene.add(box);

        const sphere = new Three.Mesh(new Three.SphereGeometry(0.7, 32, 32), material);
        sphere.position.set(1, 0, 0);
        this._scene.add(sphere);
    }
    ////////////////////////////////////////////////////////////////////////////////////


    _setupControls() {
        new OrbitControls(this._camera, this._divContainer);
    }

    resize() {
        // 3D 그래픽을 출력할 영역 width, height 얻어오기
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        // 출력할 영역 width, height로 aspect 계산하여 카메라 aspect를 설정
        this._camera.aspect = width / height;
        // 변경된 aspect를 바탕으로 ProjectionMatrix 업데이트
        this._camera.updateProjectionMatrix();

        // 출력 영역 크기를 바탕으로 렌더러 크기 설정
        this._renderer.setSize(width, height);
    }

    render(time) {
        // Scene을 카메라 시점으로 렌더링하라는 코드
        this._renderer.render(this._scene, this._camera);
        // update 메서드 안에서는 time 인자를 바탕으로 애니메이션 효과 발생
        this.update(time);
        // requestAnimationFrame을 통하여 render 메서드가 반복적으로 호출될 수 있다.
        requestAnimationFrame(this.render.bind(this));
    }

    update(time) {
        // 밀리초에서 초로 변환
        time *= 0.001;
    }
}

window.onload = function () {
    new App();
}