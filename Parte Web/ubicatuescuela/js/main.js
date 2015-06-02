var editar, puntoActual, punto, botonPresionado, editandoPunto = false,puntoAEditar, entro = false, mylocate;
$('[data-role="page"]').live('pageshow', function () {
	var x = getUrlParameter('x');
	var y = getUrlParameter('y');
	console.log("valores"+x+y);
	var map = L.map('map').setView([y,x], 18);
	var basemap = L.esri.basemapLayer("Streets");
	basemap.addTo(map);
	var iconos = {
	    censado: L.icon({
	      iconUrl: 'imagenes/censado.png',
	      iconSize: [20, 31]
	    }),
	    porCensar: L.icon({
	      iconUrl: 'imagenes/porcensar.png',
	      iconSize: [27, 27]
	    })
	  };
	var capa = L.esri.clusteredFeatureLayer('http://services.arcgis.com/doh7A7RjAthUwbzt/arcgis/rest/services/Escuelas/FeatureServer/0',{
		pointToLayer: function (geojson, latlng) {
		  var icono = (geojson.properties.Estado == 0) ? "porCensar" : (geojson.properties.Estado == 1) ? "censado" : 'none';
		  var texto = geojson.properties.name;
		  var marker = L.marker(latlng, {
		    icon: iconos[icono]
		  });
		  //marker.bindLabel("My Label", {noHide: true, className: "my-label", offset: [0, 0] });
		  console.log("marker:",marker);
		  return marker;
		}
  	}).addTo(map);
	capa.bindPopup(function(feature){
		//var condicion = (feature.properties.CONDICION == null) ? "vacio" : (feature.properties.CONDICION == 1) ? "Bueno" : (feature.properties.CONDICION == 2) ? "Necesita Mejoras" : "Reemplazo";
		var nombre = (feature.properties.Nombre == null) ? "vacio" : feature.properties.Nombre;
		//var distrito = (feature.properties.DIST_NOM == null) ? "vacio" : feature.properties.DIST_NOM;
		//var corregimiento = (feature.properties.CORR_NOM == null) ? "vacio" : feature.properties.CORR_NOM;
		//var internet = (feature.properties.INTERNET == null) ? "vacio" : (feature.properties.INTERNET == 1) ? "Si" : "No";
		var censado = (feature.properties.Estado == 0) ? "POR VERIFICAR" : "VERIFICADO";
		var comentarios = (feature.properties.Comentarios == null) ? "vacio" : feature.properties.Comentarios;
		return '<img src="imagenes/editar.png" name="'+feature.properties.OBJECTID+'" onclick="editarPunto(this)" id="imagenPopUp">'+L.Util.template('<strong>Nombre: </strong>'+nombre+'<br><strong>Censado: </strong>'+censado+'<br><strong>Comentarios: </strong>'+comentarios+'<br><br><br>', feature.properties);
	});
	var lc = L.control.locate({
		drawCircle: false,
		keepCurrentZoomLevel: false,
		locateOptions: {
        	maxZoom: 20
		}
	}).addTo(map);

	
	if(x==1)
		map.locate({setView: true, maxZoom: 10});
	map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);
	map.on('click', function(e) {
	  longClick(e.latlng);
	});
	$(".leaflet-control-zoom-in").html('');
	$('.leaflet-control-zoom-out').html('');
	 $('.botones').click(function() {
          botonPresionado = $(this).attr('name')
    })

	$("#form").submit(function (){
		if(!editandoPunto){
			if(botonPresionado == "guardar"){
				$("#popupMenu-screen").click();
				//$('select').selectmenu('refresh', true);
				agregarPunto();
			}
			else{
				$('#form').trigger("reset");
				$("#popupMenu-screen").click();
				map.setZoom(map.getZoom()+1);
				editar = false;
				$('.ui-select select').val('').selectmenu('refresh');
				$("#footer").html("");
			}
		}else{
			if(botonPresionado == "guardar"){
				$("#popupMenu-screen").click();
				//$('select').selectmenu('refresh', true);
				editarPunto();
			}
			else{
				$('#form').trigger("reset");
				$("#popupMenu-screen").click();
				map.setZoom(map.getZoom()+1);
				editar = false;
				editandoPunto = false;
				$("#footer").html("");
				$('.ui-select select').val('').selectmenu('refresh');
			}
		}
		return false;
	});

	$("#boton").click(function() {
		$("#footer").html("Presione en el mapa para agregar nueva escuela");
	    habilitarEdicion();
	});
	function longClick(puntoNuevo){
		if(editar){
			punto = puntoNuevo;
			map.setZoom(map.getZoom()-1);
			$("#formulario").click();
		}
	}

	function agregarPunto(){
		$("#cargando").show();
		require([
	      "dojo/parser","esri/geometry/Point","esri/symbols/SimpleMarkerSymbol","esri/Color","esri/graphic","esri/layers/FeatureLayer","esri/SpatialReference","dojo/domReady!"
	    ], function(
	      parser, Point, SimpleMarkerSymbol, Color,Graphic,FeatureLayer,SpatialReference
	    ) {
	    	parser.parse();
	    	var featureLayer = new FeatureLayer("http://services.arcgis.com/doh7A7RjAthUwbzt/arcgis/rest/services/Escuelas/FeatureServer/0",{
		      mode: FeatureLayer.MODE_ONDEMAND,
		      outFields: ["*"]
		    });
		    featureLayer.on("load", function(evt) {
				var pt = new Point(punto.lng,punto.lat,new SpatialReference(4326));
				var sms = new SimpleMarkerSymbol().setStyle(
					SimpleMarkerSymbol.STYLE_SQUARE).setColor(
		            new Color([255,0,0,0.5]));
		        var values = {};
		        $.each($('#form').serializeArray(), function(i, field) {
				    values[field.name] = field.value;
				});
		        var attr = {"nombre":values["ce"],"Estado":values["censado"],"Comentarios":values["com"]};
		        var graphic = new Graphic(pt,sms,attr);
		        //featureLayer.applyEdits([graphic]);
		        featureLayer.applyEdits([graphic], null, null, function(addResults) {
	              map.setView(punto, 20);
	              $("#cargando").hide();
	              editar = false;
	              $("#footer").html("Punto agregado");
	              $('.ui-select select').val('').selectmenu('refresh');
	              $('#form').trigger("reset");
	            }, function(err){
	            	map.setZoom(map.getZoom()+1);
	            	$("#cargando").hide();
	            	console.log("Error: "+err);
	            	$("#footer").html("");
	            	editar = false;
	            	$('#form').trigger("reset");
	            });
		    });
	    });
	}

	function editarPunto(){
		$("#cargando").show();
		require([
	      "dojo/parser","esri/geometry/Point","esri/symbols/SimpleMarkerSymbol","esri/Color","esri/graphic","esri/layers/FeatureLayer","esri/SpatialReference","dojo/domReady!"
	    ], function(
	      parser, Point, SimpleMarkerSymbol, Color,Graphic,FeatureLayer,SpatialReference
	    ) {
	    	parser.parse();
	    	var featureLayer = new FeatureLayer("http://services.arcgis.com/doh7A7RjAthUwbzt/arcgis/rest/services/Escuelas/FeatureServer/0",{
		      mode: FeatureLayer.MODE_ONDEMAND,
		      outFields: ["*"]
		    });
		    featureLayer.on("load", function(evt) {
				var values = {};
		        $.each($('#form').serializeArray(), function(i, field) {
				    values[field.name] = field.value;
				});
				puntoAEditar.attributes.Nombre = values["ce"];
				puntoAEditar.attributes.Estado = values["censado"];
				puntoAEditar.attributes.Comentarios = values["com"];
		        //var attr = {"name":values["ce"],"CONDICION":values["cd"],"INTERNET":values["it"],"CENSADO":values["censado"]};
		        //var graphic = new Graphic(pt,sms,attr);
		        //featureLayer.applyEdits([graphic]);
		        console.log("despues",puntoAEditar);
		        featureLayer.applyEdits(null,[puntoAEditar], null, function(addResults) {
	              map.setView(puntoAEditar, 20);
	              $("#cargando").hide();
	              editandoPunto = false;
	              $("#footer").html("Punto editado");
	              $('.ui-select select').val('').selectmenu('refresh');
	              $('#form').trigger("reset");
	              $(".leaflet-popup-close-button").click();
	              window.location = "index.html?x="+puntoAEditar.geometry.x+"&y="+puntoAEditar.geometry.y+"";
	            }, function(err){
	            	map.setZoom(map.getZoom()+1);
	            	$("#cargando").hide();
	            	console.log("Error: "+err);
	            	editar = false;
	            	$("#footer").html("");
	            	$('#form').trigger("reset");
	            	window.location = "index.html?x="+puntoAEditar.geometry.x+"&y="+puntoAEditar.geometry.y+"";
	            });
		    });
	    });
	}

	function agregarAtributos(){
	    puntoActual.feature.properties.name = "test";
	    capa.updateFeature({
	      type: 'Feature',
	      id: puntoActual.feature.id,
	      geometry: puntoActual.toGeoJSON().geometry,
	      properties: puntoActual.feature.properties
	    }, function(error, response) {
	      console.log(error, response);
	    });
	}

	function onLocationFound(e) {
	    if(!entro){
	    	var myIcon = L.icon({
			    iconUrl: 'imagenes/mylocation.png',
			    iconSize: [45, 38]
			});
	    	mylocate = L.marker(e.latlng,{
	    		icon : myIcon
	    	}).addTo(map);
	    	entro = true;
	    }else{
	    	mylocate.setLatLng(e.latlng);
	    }
	    map.setZoom(20);
	}
	function onLocationError(e) {
	    alert(e.message);
	}

	function habilitarEdicion(){
		editar = true;
	}
	function getUrlParameter(sParam){
	    var sPageURL = window.location.search.substring(1);
	    var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++) 
	    {
	        var sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] == sParam) 
	        {
	            return sParameterName[1];
	        }
	    }
	    return 1;
	}          
});

function editarPunto(boton){
	$("#cargando").show();
	editandoPunto = true;
	require([
	  "esri/tasks/query", "esri/tasks/QueryTask"
	], function(Query, QueryTask) {
		var featureLayer = new QueryTask("http://services.arcgis.com/doh7A7RjAthUwbzt/arcgis/rest/services/Escuelas/FeatureServer/0");
		var query = new Query();
		query.outFields = ['*'];
		query.returnGeometry = true;
		query.objectIds = [boton.name];
		query.where = "1=1";
		featureLayer.execute(query, showResults);
	});
}
function showResults(results) {
	puntoAEditar = results.features[0];
	console.log("LAt:",puntoAEditar.geometry);
	$("#footer").html("Edite los cambios que desea");
	var nombre = (puntoAEditar.attributes.Nombre == null) ? "vacio" : puntoAEditar.attributes.Nombre;
	$('#ce').val(nombre);
	/*$('#cd').val(puntoAEditar.attributes.CONDICION).selectmenu('refresh');
	$('#it').val(puntoAEditar.attributes.INTERNET).selectmenu('refresh');*/
	$('#censado').val(puntoAEditar.attributes.Estado).selectmenu('refresh');
	$('#com').val(puntoAEditar.attributes.Comentarios);
	$("#formulario").click();
	$("#cargando").hide();
}    