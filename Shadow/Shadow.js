import * as Three from '../three.js/three.module.js';
import { OrbitControls } from '../three.js/OrbitControls.js';

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

        // 그림자 맵 활성화
        renderer.shadowMap.enabled = true;

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
        //camera.position.z = 2;
        // 카메라 위치 설정
        camera.position.set(7, 7, 0);
        // 카메라가 원점을 바라보도록 설정
        camera.lookAt(0, 0, 0);

        // 다른 메서드에서 참조할 수 있도록 필드에 정의한다.
        this._camera = camera;
    }

    _setupLight() {
        // 그림자를 뚜렷하게 보기 위해 광원을 하나 더 추가한다.
        const auxLight = new Three.DirectionalLight(0xffffff, 0.5);
        auxLight.position.set(0, 5, 0);
        auxLight.target.position.set(0, 0, 0);
        this._scene.add(auxLight.target);
        this._scene.add(auxLight);


        ////////////////////////////////////////////////////////////////////////////////
        // // 광원 색상 설정
        // const color = 0xffffff;
        // // 광원 세기 설정
        // const intensity = 5;
        // // AmbientLight : 단순히 scene에 존재하는 모든 물체에 대해서 단일 색상으로 렌더링되도록 한다.
        // // 대부분의 경우 세기값을 매우 약하게 지정해서 장면에 추가된다.
        // // 광원의 영향을 받지 못하는 물체도 살짝 보여지도록 하는데 사용된다.
        // const light = new Three.AmbientLight(color, intensity);
        ////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////////
        // // HemisphereLight : 주변광, AmbientLight와는 다르게 빛에 대한 색상값이 두 개이다.
        // // 첫 번째 인자 위에서 비치는 빛의 색상
        // // 두 번째 인자 아래에서 비치는 빛의 색상
        // const light = new Three.HemisphereLight("#b0d8f5", "#bb7a1c", 1);
        ////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////////
        // // DirectionalLight : 태양과 같이 빛의 물체간의 거리에 상관없이 동일한 빛의 효과
        // const light = new Three.DirectionalLight(0xffffff, 0.5);
        // // 빛의 position과 target 속성의 position으로 결정되는 방향만이 의미가 있다.
        // light.position.set(0, 5, 0);
        // light.target.position.set(0, 0, 0);
        // this._scene.add(light.target);

        // // 그림자가 잘리는 현상을 해결하기 위해 그림자를 위한 절두체를 좀 더 크게 설정
        // light.shadow.camera.top = light.shadow.camera.right = 6;
        // light.shadow.camera.bottom = light.shadow.camera.left = -6;

        // // 그림자의 품질 향상
        // // 텍스처 맵핑 크기를 기본 512에서 크기를 키워주면 그림자 품질이 향상된다.
        // light.shadow.mapSize.width = light.shadow.mapSize.height = 1024;

        // // 상황에 따라 그림자의 경계가 선명하지 않고 블러링 처리가 필요가 있다.
        // // 이를 위해 shadow의 radius 값을 통해 설정할 수 있다.
        // // 기본값이 1인데 값이 커질수록 그림자 외곽의 블러링 효과가 강해진다.
        // light.shadow.radius = 1;


        // // // 이 광원을 화면상에 시각화 해주는 helper 객체
        // // const helper = new Three.DirectionalLightHelper(light);
        // // this._scene.add(helper);
        // // this._lightHelper = helper;
        ////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////////
        // // PointLight : 한 점에서 사방으로 비추는 빛
        // const light = new Three.PointLight(0xffffff, 2);
        // light.position.set(0, 5, 0);

        // // distance로 설정한 거리까지만 광원의 영향을 받는다.
        // // 0으로 설정하면 무한
        // light.distance = 10;

        // // // 이 광원을 화면상에 시각화 해주는 helper 객체
        // // const helper = new Three.PointLightHelper(light);
        // // this._scene.add(helper);
        // // this._lightHelper = helper;
        ////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////////
        // SpotLight : 광원 위치에서 원뿔 모양으로 퍼져나가는 빛
        const light = new Three.SpotLight(0xffffff, 1);
        light.position.set(0, 5, 0);
        light.target.position.set(0, 0, 0);
        light.angle = Three.MathUtils.degToRad(30);
        // 빛의 감쇄율
        // 0은 빛의 감쇄가 전혀 없다는 뜻
        light.penumbra = 0.2;
        this._scene.add(light.target);

        // // 이 광원을 화면상에 시각화 해주는 helper 객체
        // const helper = new Three.SpotLightHelper(light);
        // this._scene.add(helper);
        // this._lightHelper = helper;
        ////////////////////////////////////////////////////////////////////////////////



        // 광원의 그림자를 위한 카메라를 시각화
        // 그림자를 지원하는 광원은 모두 shadow라는 속성을 갖고, 이 shadow 속성에는 camera 속성이 존재한다.
        // 이 camera가 그림자에 대한 텍스처 이미지를 생성하기 위해 사용된다.
        // DirectionalLight의 그림자를 위한 카메라는 OrthographicCamera라 절두체를 벗어난 객체는 모두 잘려나간다.
        // 그림자가 잘려 보이는 것은 절두체를 벗어나기 때문이다.
        // 이런 현상을 해결하기 위해서는 그림자를 위한 절두체를 좀 더 크게 설정하면 된다.
        const cameraHelper = new Three.CameraHelper(light.shadow.camera);
        this._scene.add(cameraHelper);



        //Scene객체에 광원 추가
        this._scene.add(light);

        this._light = light;

        // 광원에서 그림자를 줄 것인지 여부
        light.castShadow = true;
    }

    _setupModel() {
        ////////////////////////////////////////////////////////////////////////////////
        const groundGeometry = new Three.PlaneGeometry(10, 10);
        const groundMaterial = new Three.MeshStandardMaterial({
            color: "#2c3e50",
            roughness: 0.5,
            metalness: 0.5,
            side: Three.DoubleSide
        });

        const ground = new Three.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = Three.MathUtils.degToRad(-90);

        // ground는 그림자를 받아 그림자를 표현하도록 설정
        ground.receiveShadow = true;

        this._scene.add(ground);
        ////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////////
        //const bigSphereGeometry = new Three.SphereGeometry(1.5, 64, 64, 0, Math.PI);
        const torusKnotGeometry = new Three.TorusKnotBufferGeometry(1, 0.3, 128, 64, 2, 3);
        const bigSphereMaterial = new Three.MeshStandardMaterial({
            color: "#ffffff",
            roughness: 0.1,
            metalness: 0.2,
        });
        const torusKnot = new Three.Mesh(torusKnotGeometry, bigSphereMaterial);
        //torusKnot.rotation.x = Three.MathUtils.degToRad(-90);
        torusKnot.position.y = 1.6;

        // torusKnot이 그림자를 받아 그림자를 표현하도록 설정
        torusKnot.receiveShadow = true;
        // torusKnot은 그림자를 주기도 한다.
        torusKnot.castShadow = true;

        this._scene.add(torusKnot);
        ////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////////
        const torusGeometry = new Three.TorusGeometry(0.4, 0.1, 32, 32);
        const torusMaterial = new Three.MeshStandardMaterial({
            color: "#9b59b6",
            roughness: 0.5,
            metalness: 0.9,
        });

        for (let i = 0; i < 8; i++) {
            const torusPivot = new Three.Object3D();
            const torus = new Three.Mesh(torusGeometry, torusMaterial);
            torusPivot.rotation.y = Three.MathUtils.degToRad(45 * i);
            torus.position.set(3, 0.5, 0);
            torusPivot.add(torus);

            // torus 그림자를 받아 그림자를 표현하도록 설정
            torus.receiveShadow = true;
            // torus 그림자를 주기도 한다.
            torus.castShadow = true;

            this._scene.add(torusPivot);
        }
        ////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////////
        const smallSphereGeometry = new Three.SphereGeometry(0.3, 32, 32);
        const smallSphereMaterial = new Three.MeshStandardMaterial({
            color: "#e74c3c",
            roughness: 0.2,
            metalness: 0.5,
        });
        const smallSpherePivot = new Three.Object3D();
        const smallSphere = new Three.Mesh(smallSphereGeometry, smallSphereMaterial);
        smallSpherePivot.add(smallSphere);
        // 이름을 부여한 객체는 Scene을 통해서 조회할 수 있다.
        smallSpherePivot.name = "smallSpherePivot";
        smallSphere.position.set(3, 0.5, 0);

        // smallSphere 그림자를 받아 그림자를 표현하도록 설정
        smallSphere.receiveShadow = true;
        // smallSphere 그림자를 주기도 한다.
        smallSphere.castShadow = true;

        this._scene.add(smallSpherePivot);
        ////////////////////////////////////////////////////////////////////////////////
    }

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

        // 이름 부여한 객체 가져오기
        const smallSpherePivot = this._scene.getObjectByName("smallSpherePivot");
        if (smallSpherePivot) {
            // 작은 구 회전하도록 설정
            smallSpherePivot.rotation.y = Three.MathUtils.degToRad(time * 50);


            ////////////////////////////////////////////////////////////////////////////
            // // DirectionLight가 작은 구를 추적하면서 비추기
            // if (this._light.target) {
            //     // 첫 번째 자식 가져오기
            //     const smallSphere = smallSpherePivot.children[0];
            //     // 월드 좌표를 가져와서 광원의 타깃 위치로 설정
            //     smallSphere.getWorldPosition(this._light.target.position);

            //     // LightHelper를 업데이트
            //     if (this._lightHelper) this._lightHelper.update();
            // }
            ////////////////////////////////////////////////////////////////////////////

            ////////////////////////////////////////////////////////////////////////////
            // // PointLight가 작은 구에서 빛을 방사
            // if (this._light) {
            //     // 첫 번째 자식 가져오기
            //     const smallSphere = smallSpherePivot.children[0];
            //     // 월드 좌표를 가져와서 광원의 타깃 위치로 설정
            //     smallSphere.getWorldPosition(this._light.position);

            //     // LightHelper를 업데이트
            //     if (this._lightHelper) this._lightHelper.update();
            // }
            ////////////////////////////////////////////////////////////////////////////

            ////////////////////////////////////////////////////////////////////////////
            // SpotLigth가 작은 구를 추적하면서 비추기
            if (this._light.target) {
                // 첫 번째 자식 가져오기
                const smallSphere = smallSpherePivot.children[0];
                // 월드 좌표를 가져와서 광원의 타깃 위치로 설정
                smallSphere.getWorldPosition(this._light.target.position);

                // LightHelper를 업데이트
                if (this._lightHelper) this._lightHelper.update();
            }
            ////////////////////////////////////////////////////////////////////////////
        }
    }
}

window.onload = function () {
    new App();
}