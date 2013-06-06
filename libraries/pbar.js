function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
			  if (typeof stroke == "undefined" ) {
				stroke = true;
			  }
			  if (typeof radius === "undefined") {
				radius = 5;
			  }
			  
			  //edge clearing
			  
			  var gdest = ctx.globalCompositeOperation;
			  var fstyle = ctx.fillStyle;
			  ctx.globalCompositeOperation = "destination-out";			  
			  ctx.fillStyle = "rgba(0,0,0,1.0)";
			 
			  ctx.beginPath();
			  ctx.moveTo(x, y+radius);
			  ctx.quadraticCurveTo(x, y, x + radius, y);
			  ctx.lineTo(x, y);
			  ctx.lineTo(x, y+radius);			 
			  ctx.closePath(); 		
			  ctx.fill();
			  
			  ctx.beginPath();
			  ctx.moveTo(x, y+height-radius);
			  ctx.quadraticCurveTo(x, y+height, x + radius, y+height);
			  ctx.lineTo(x, y+height);
			  ctx.lineTo(x, y+height-radius);			 
			  ctx.closePath(); 		
			  ctx.fill();
			  
			  ctx.beginPath();
			  ctx.moveTo(x+width-radius, y);
			  ctx.quadraticCurveTo(x+width, y, x + width, y+radius);
			  ctx.lineTo(x+width, y);
			  ctx.lineTo(x+width-radius, y);			 
			  ctx.closePath(); 		
			  ctx.fill();
			  
			  ctx.beginPath();
			  ctx.moveTo(x+width, y+height-radius);
			  ctx.quadraticCurveTo(x+width, y+height, x+width - radius, y+height);
			  ctx.lineTo(x+width, y+height);
			  ctx.lineTo(x+width, y+height-radius);			 
			  ctx.closePath(); 		
			  ctx.fill();
			  
			  ctx.fillStyle = fstyle;
			  ctx.globalCompositeOperation = gdest;
			  


			  
			  //round rect
			  ctx.beginPath();
			  ctx.moveTo(x + radius, y);
			  ctx.lineTo(x + width - radius, y);
			  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
			  ctx.lineTo(x + width, y + height - radius);
			  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			  ctx.lineTo(x + radius, y + height);
			  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
			  ctx.lineTo(x, y + radius);
			  ctx.quadraticCurveTo(x, y, x + radius, y);
			  ctx.closePath(); 			  
			  if (stroke) {
				ctx.stroke();
			  }
			  if (fill) {
				ctx.fill();
			  } 
 

			}

			
			var ii = 0;
			
					
			function isNumber(n) 
			{
			  return !isNaN(parseFloat(n)) && isFinite(n);
			}
			
			function drawCanvas(percentage, canvasid , context)
			{			
										
				var error = !isNumber(percentage);
				
				if (!error && (percentage < 0 || percentage > 100))
				{
					error = true;
				}
				
				percentage = percentage.toString().replace(/[^0-9]/g, '');
				
				var canvas = canvasid;
				var context = context;
	

				var barheight = 450;
				var borderSize = 25;
				
				if(canvas.getContext){
					
					context.clearRect(0,barheight,canvas.width,borderSize);
					
					context.fillStyle = "rgb(143, 143, 143)";
					context.fillRect(0, barheight, canvas.width, borderSize);
					
					var percWidth = Math.round(canvas.width / 100);
					
					if (!error)
					{
						for (var i = 0; i<= percentage; i++)
						{						
							var r,g,b;
							if (i <= 50)
							{
								r = 255;
								g = Math.round((255*i)/50);
								b = 0;
							}
							else
							{
								r = Math.round((255*(100-i))/50);
								g = 255;
								b = 0
							}						
							context.fillStyle = "rgb("+r+", "+g+", "+b+")";
							context.fillRect(Math.round(i*canvas.width / 100)-percWidth, barheight, percWidth, borderSize);					
						}
						
						context.font = "bold 30px sans-serif";
						context.fillStyle = "rgb(255,255,255)";
						context.textBaseline = "middle";
						var msg = percentage + "%";
					}
					else
					{
						context.fillStyle = "rgb(255,0,0)";
						context.fillRect(0,barheight,canvas.width, borderSize);
						context.font = "bold 30px sans-serif";
						context.fillStyle = "rgb(255,255,255)";
						context.textBaseline = "middle";
						var msg = "ERROR: Wrong input";
					}
					
					context.fillStyle = "rgb(60,60,60)";
					context.fillText(msg, (canvas.width/2)-(context.measureText(msg).width/2)+2 , (barheight - 15)+2);
					context.fillStyle = "rgb(90,90,90)";
					context.fillText(msg, (canvas.width/2)-(context.measureText(msg).width/2)+1 , (barheight - 15)+1);
					context.fillStyle = "rgb(255,255,255)";
					context.fillText(msg, (canvas.width/2)-(context.measureText(msg).width/2) , (barheight - 15));
					context.strokeText(msg, (canvas.width/2)-(context.measureText(msg).width/2) , (barheight - 15));
					
					context.globalAlpha = 0.4;
					context.fillStyle = "rgb(255, 255, 255)";
					context.fillRect(0, barheight, canvas.width, ((borderSize )/32)*15);
					context.globalAlpha = 1.0;
					
					context.fillStyle = "rgb(0, 0, 0)";					
					roundRect(context, 0,barheight,canvas.width,borderSize,10);
				}
				
			}