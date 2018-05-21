(function(){

	var scene, points, renderer, camera, controllers,
		width, height, stats, container;
	
	function initScene(){

		scene = new THREE.Scene();

		getWindowSize();

		container = document.getElementById('3dcg');

		// rendering
		renderer = new THREE.WebGLRenderer({ antialias: false });

		renderer.setClearColor("#000000", 1);

		renderer.setPixelRatio( window.devicePixelRatio );

		renderer.setSize(width, height);

		
		container.appendChild(renderer.domElement);

		// camera
		camera = new THREE.PerspectiveCamera(90, width / height, 1, 20000);
		//      camera.position.set(50,-50,500);
		camera.position.set(50,1800,880);
		camera.rotation.x = -1.2;

		// light
		var light = new THREE.DirectionalLight("#ffffff", 1);
		light.position.set(1500,0,1000);
		light.castShadow = true;
		scene.add(light);
		var ambient = new THREE.AmbientLight("#222222", 1);
		scene.add(ambient);

		controls = new THREE.OrbitControls(camera, renderer.domElement);

		stats = new Stats();
		stats.dom.id = "gl-stats";
		container.appendChild( stats.dom );

	}

	function render() {
		
		//getWindowSize();   
		//renderer.setSize(width, height);

		requestAnimationFrame(render);

		renderer.render(scene, camera);
		controls.update();

		stats.update();


    }

    function updatePointCloud(arr){

    	colors = arr[1];
    	arr = arr[0];
    	var width = arr[0].length, height = arr.length, i = 0;

    	const scale = 3.0;

    	for(var y=0; y<height; y++){
    		
    		for(var x=0; x<width; x++){

    			depth = arr[y][x] * 400.0 - 200;

    			points.geometry.vertices[i].set( (x - width/2) * scale, - (y - height/2) * scale, - depth );

    			points.geometry.colors[i].setRGB( colors[y][x][2] / 255, colors[y][x][1] /255, colors[y][x][0] /255);

    			points.geometry.colorsNeedUpdate = true;

    			i++;
		
    		}
    	
    	}

    	points.geometry.verticesNeedUpdate = true;

    	console.log("update");
    }

    function createPointCloud( arr ){
        
        arr = arr[0];
        var size = arr[0].length * arr.length;

        var colors = [];

        var geometry = new THREE.Geometry();
        
		for(var i=0; i<size; i++){

        	geometry.vertices[ i ] = new THREE.Vector3(); 

        	colors.push(new THREE.Color());
		
		}
        
		var material =  new THREE.PointsMaterial({
		    vertexColors: true,
		    size: 1.0,
		    sizeAttenuation: false,
		  });


		geometry.colors = colors;
		points = new THREE.Points( geometry, material);
        
        scene.add(points);

    }	

	function getWindowSize() {
		width = window.innerWidth;
		height = window.innerHeight;
	}

	function initWS(){
		//var connection = new WebSocket('ws://192.168.1.52:8000/');
		var connection = new WebSocket('ws://127.0.0.1:8000/');
		var data, arr;
		
		connection.onopen = function () {
			//connection.send('Ping'); // Send the message 'Ping' to the server
		};

		// Log errors
		connection.onerror = function (error) {
 			console.log('WebSocket Error ' + error);
		};

		// Log messages from the server
		connection.onmessage = function (e) {
			//console.log('Server: ' + e.data);
			data = e.data;
			arr = JSON.parse(data);
			
			if( !points ){

				createPointCloud(arr);

			}
			
			updatePointCloud(arr);
		};
	}




    window.onload = function(){

    	initScene();
    	render();
    	initWS();


    };

})();