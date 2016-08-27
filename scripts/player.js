  
  var key = 'PM-Session';
  
  var start = function(){
    if(window.location.hash) {
      var storyId = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
      loadStory(storyId);  
    }
    else {
      loadStory(0);
    }
  };
 

  var loadStory = function(id){
    // Fetch the external template.
      var scene = document.querySelector('#mainStory');
      
     
      var request = new XMLHttpRequest();
      request.addEventListener('load', monsterLoaded);
      request.open('GET', '/dataset/casos.json');
      request.send();
       function monsterLoaded() {
        // Compile the fetched template.
        var casosString = request.response;
        var casos = JSON.parse(casosString);
        var c = casos[id];
        c.fecha = c['Fecha'];
        c.estado = c['Estado Procesal de la Causa'];
        var keySigue = c['QuienllevaCausa'];
        c.nombreSigue = c[keySigue];
        c.responsables = c['Fuerza responsable'] ;
        setTemplate(casos[id]);
      };

      function setTemplate(caso){
           var req = new XMLHttpRequest();
        req.addEventListener('load', treeLoaded);
        req.open('GET', '/scripts/anvi.slider.template');
        req.send();
       function treeLoaded(dataLoaded) {
          // Compile the fetched template.
          var treeTemplateStr = req.response;
          var treeTemplate = nunjucks.compile(treeTemplateStr);
          var treeEntityStr = treeTemplate.render(caso);
          scene.insertAdjacentHTML('beforeend', treeEntityStr);
          new WOW().init();
        };
      }
      
    };

    start();

    