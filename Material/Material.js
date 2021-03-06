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
        camera.position.z = 7;
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
    // PointsMaterial로 Points 객체를 생성하는 _setupModel 메서드
    // _setupModel() {
    //     const vertices = [];
    //     // 1000개의 좌표를 -5 ~ 5 사이의 랜덤 값으로 설정
    //     for (let i = 0; i < 10000; i++) {
    //         const x = Three.MathUtils.randFloatSpread(5);
    //         const y = Three.MathUtils.randFloatSpread(5);
    //         const z = Three.MathUtils.randFloatSpread(5);

    //         vertices.push(x, y, z);
    //     }

    //     // BufferGeometry 객체 생성
    //     const geometry = new Three.BufferGeometry();
    //     // "position"으로 위치 좌표 데이터임을 알려준다.
    //     // buffer에 담기는 데이터의 3개의 값이 하나의 좌표라는 Attribute 설정으로 알려준다.
    //     geometry.setAttribute(
    //         "position",
    //         new Three.Float32BufferAttribute(vertices, 3),
    //     )        

    //     /////// PointsMaterial 객체 생성 ///////////////////////////////////////////////

    //     const sprite = new Three.TextureLoader().load("../three.js/disc.png");

    //     // const material = new Three.PointsMaterial({
    //     //     color: "#00ffff",
    //     //     size: 0.1,
    //     //     // 카메라 위치에 따라 포인트 크기를 다르게 할지
    //     //     sizeAttenuation: true,
    //     // })

    //     // PointMaterial에 texture를 읽어와 적용하여 원이 그려지도록 설정
    //     const material = new Three.PointsMaterial({
    //         map: sprite,
    //         // 알파값이 alphaTest 값보다 클때만 픽셀이 렌더링된다.
    //         alphaTest: 0.5,

    //         color: "#00ffff",
    //         size: 0.1,
    //         // 카메라 위치에 따라 포인트 크기를 다르게 할지
    //         sizeAttenuation: true,
    //     })

    //     ////////////////////////////////////////////////////////////////////////////////

    //     // BufferGeometry, PointsMaterial로 Points 객체를 생성한다.
    //     const points = new Three.Points(geometry, material);
    //     this._scene.add(points);
    // }


    ////////////////////////////////////////////////////////////////////////////////////
    // LineBasicMaterial, LineDashedMaterial로 Line, LineSegments, LineLoop 객체 생성 실습
    _setupModel() {
        const vertices = [
            -1, 1, 0,
            1, 1, 0,
            -1, -1, 0,
            1, -1, 0,
        ];

        const geometry = new Three.BufferGeometry();
        geometry.setAttribute("position", new Three.Float32BufferAttribute(vertices, 3));

        // const material = new Three.LineBasicMaterial({
        //     color: 0xff0000,
        // });

        const material = new Three.LineDashedMaterial({
            color: 0xffff00,
            // dashSize 만큼 선이 그려진다.
            dashSize: 0.2,
            // gapSize 만큼 선이 안그려진다.
            gapSize: 0.1,
            // 커질수록 촘촘해진다.
            scale: 4,
        })

        // Line, LineSegments, LineLoop 각각의 객체 생성하면 어떻게 표현되는지 확인
        const line = new Three.Line(geometry, material);
        //const line = new Three.LineSegments(geometry, material);
        //const line = new Three.LineLoop(geometry, material);

        // LineDashedMaterial를 사용 시 추가해 줘야 한다.
        line.computeLineDistances();

        this._scene.add(line);
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