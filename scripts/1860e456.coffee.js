(function(){window.Ball=function(){function a(a){this.maxWidth=a.maxWidth||0,this.maxHeight=a.maxHeight||0,this.radius=a.radius||10,this.speed=a.speed||5,this.position=a.position||{x:this.maxWidth/2,y:this.maxHeight/2},this.direction=a.direction||0}return a.prototype.draw=function(a){return a.beginPath(),a.arc(this.position.x,this.position.y,this.radius,0,2*Math.PI,!0),a.closePath(),a.fill()},a.prototype.move=function(){return this.position.y-this.radius<=0?this.direction=360-this.direction:this.position.y+this.radius>=this.maxHeight?this.direction=360-this.direction:this.position.x-this.radius<=0?this.direction=180-this.direction:this.position.x+this.radius>=this.maxWidth&&(this.direction=180-this.direction),this.position.x+=Math.cos(this.direction*Math.PI/180)*this.speed,this.position.y-=Math.sin(this.direction*Math.PI/180)*this.speed},a}()}).call(this),function(){var a,b,c,d,e,f,g,h;for(b=document.getElementById("canvas"),c=b.getContext("2d"),g=b.width=window.innerWidth,e=b.height=window.innerHeight,d=20,a=[],f=h=5;30>=h;f=++h)a.push(new Ball({maxWidth:g,maxHeight:e,direction:30+f,speed:5+f}));setInterval(function(){return c.clearRect(0,0,g,e),a.forEach(function(a){return a.move(),a.draw(c)})},d)}.call(this);