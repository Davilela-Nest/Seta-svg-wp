jQuery(document).ready(function( $ ){
	let svgs = [];
	
	//uma ideia legal seria criar uma reta diferente, ela desce um pouco vai para perto de uma das laterias da tela desce até perto do elemento e vai até o elemento2
	//adicionar z index
	//mudar o nome das variáveis que são px e as que são percentil
	function createSVG(element1Selector, element2Selector, options){ 
		let defaults = {
			posicaoElemento1: 'central',
			posicaoElemento2: 'central',
			offSetsComputador: {
				vertical1: 0,
				horizontal1Percent: 0,
				vertical2: 0,
				horizontal2Percent: 0,
			},
			offSetsCelular: {
				vertical1: 0,
				horizontal1Percent: 0,
				vertical2: 0,
				horizontal2Percent: 0,
			},
			offSetComplexo: {
				tamanhoLinhaInicial : 0,
				ajusteLimiteTelaLateral : 0,
				ajusteTamanhoLinhaVertical: 0,
				ajusteHorizontalUltimaLinha: 0,
			},
			cor: '#000000',
			espessura: 2,
			raio: 3,
			animacao: 'ever',
			tipoReta: 'inteira',
			trianguloFill: 'crecente',
			colorFillCircle: '#000000',
			offSetLinhaCentralComputer: 0,
			offSetLinhaCentralPhone: 0,
			viewInPhone: true,
			viewInTablet: true,
			viewInLaptop: true,
			viewInComputer: true,
			faixaBloqueio : {
				superior: 0,
				inferior: 0
			},	
		};
		
		
		
		let settings = Object.assign({}, defaults, options);
		
		let elemento1 = document.querySelector(element1Selector);
		let elemento2 = document.querySelector(element2Selector);
			if (elemento1 == null || elemento2 == null){
			return
		}
		let svg = document.createElementNS("https://www.w3.org/2000/svg", "svg");
		svg.style.top = "0";
		svg.style.left = "0";
		svg.style.position = "absolute";
		svg.style.zIndex = "1";
		
		let circle = document.createElementNS("https://www.w3.org/2000/svg", "path");
		circle.setAttribute("stroke-width", settings.espessura);
		circle.setAttribute('stroke', settings.cor);
		circle.setAttribute("fill", settings.colorFillCircle); 
		svg.appendChild(circle);
		
		let path = document.createElementNS("https://www.w3.org/2000/svg", "path");
		path.setAttribute("stroke-width", settings.espessura);
		path.setAttribute("fill", "none");
		path.setAttribute('stroke', settings.cor);
		svg.appendChild(path);
		
		document.body.appendChild(svg);
		
		if(settings.animacao !== 'never'){
			svg.style.strokeDasharray = '6000';
			svg.style.strokeDashoffset = '6000';
			svg.style.webkitAnimation = `dash 13s linear forwards`;
			svg.style.animation = `dash 13s linear forwards`;
		}
		
		let head = document.head || document.getElementsByTagName('head')[0];
		let style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = `
		@-webkit-keyframes dash {
			  to {
				  stroke-dashoffset: 0;
				 }
		}
		@keyframes dash {
			   to {
				  stroke-dashoffset: 0;
				  }
		}`;
		head.appendChild(style);
		svgs.push({ svg: svg, animacao: settings.animacao, cont: 1});
		function handleResize() {
			if ( window.innerWidth >= settings.faixaBloqueio.inferior && window.innerWidth <= settings.faixaBloqueio.superior ){
			svg.style.visibility = "hidden";
			svg.style.zIndex = "-3";
			return	
			}else if (!settings.viewInPhone && window.innerWidth < 481 || !settings.viewInTablet && window.innerWidth < 768 && window.innerWidth >= 481  || !settings.viewInLaptop && window.innerWidth < 1111 && window.innerWidth >= 768  ||  !settings.viewInComputer && window.innerWidth >= 1111){
			svg.style.visibility = "hidden";
			svg.style.zIndex = "-3";
			return
			}else{
				svg.style.visibility = "visible";
				svg.style.zIndex = "20";
			}
			let offSets =  {};
			let offSetLinhaCentral = 0
			if(window.innerWidth < 768){
				offSetLinhaCentral = settings.offSetLinhaCentralPhone;
				offSets = settings.offSetsCelular;
			}else{
				offSetLinhaCentral = settings.offSetLinhaCentralComputer;
				offSets = settings.offSetsComputador;
			}
			let offSetHorizontal1 = window.innerWidth * offSets.horizontal1Percent/100;
			let offSetHorizontal2 = window.innerWidth * offSets.horizontal2Percent/100;
			let dimensoes1 = elemento1.getBoundingClientRect();
			let dimensoes2 = elemento2.getBoundingClientRect();
			let pos1 = {
				top: dimensoes1.bottom + window.scrollY + offSets.vertical1,
				left: settings.posicaoElemento1 == 'esquerda' ? dimensoes1.left + offSetHorizontal1 : settings.posicaoElemento1 == 'direita' ? dimensoes1.left + dimensoes1.width + offSetHorizontal1 : dimensoes1.left + dimensoes1.width / 2 + offSetHorizontal1
			};
			let pos2 = {
				top: dimensoes2.top + window.scrollY + offSets.vertical2,
				left: settings.posicaoElemento2 == 'esquerda' ? dimensoes2.left + offSetHorizontal2 : settings.posicaoElemento2 == 'direita' ? dimensoes2.left + dimensoes2.width + offSetHorizontal2 : dimensoes2.left + dimensoes2.width / 2 + offSetHorizontal2
			};
			let distanciaVertical = Math.abs(pos1.top - pos2.top);
			let distanciaHorizontal = Math.abs(pos1.left - pos2.left);
			let meioVertical = distanciaVertical / 2;
			svg.setAttribute("height", `${distanciaVertical + settings.espessura}px`);
			svg.style.marginLeft = `${pos1.left - distanciaHorizontal - 16 - settings.espessura}px`;
			svg.setAttribute("width", `calc(100% - ${pos1.left - distanciaHorizontal - 14 - settings.espessura}px)`);
			svg.style.top = `${pos1.top}px`;
			
			if(settings.tipoReta == 'simples'){
				 let pontos = [
				`M ${distanciaHorizontal + 12} ${settings.espessura}`,
				`l 0 ${meioVertical + offSetLinhaCentral}`,
				`l ${pos2.left > pos1.left ? distanciaHorizontal - settings.espessura : -distanciaHorizontal + settings.espessura} 0`,
				`l 0 ${pos2.top - pos1.top - meioVertical - offSetLinhaCentral -15}`,
			];
				 path.setAttribute("d", pontos.join(" "));
			}else if(settings.tipoReta == 'inteira'){
				let pontosCirculo = [
				`M ${distanciaHorizontal + 13} ${settings.espessura}`,
				`a ${settings.raio} ${settings.raio} 1 1 1 0 ${2*settings.raio}`,
				`M ${distanciaHorizontal + 13} ${settings.espessura}`,
				`a ${settings.raio} ${settings.raio} 1 1 0 0 ${2*settings.raio}`,
				];
				let pontos = [
				`M ${distanciaHorizontal + 13} ${settings.espessura + 2*settings.raio}`,
				`l 0 ${meioVertical + offSetLinhaCentral - settings.raio}`,
				`l ${pos2.left > pos1.left ? distanciaHorizontal - settings.espessura : -distanciaHorizontal + settings.espessura} 0`,
				`l 0 ${pos2.top - pos1.top - meioVertical -15 - offSetLinhaCentral - settings.raio}`,       
			];
			if(settings.trianguloFill == 'crescente'){
				for(let i = 0; i <= 9; i++){
					pontos.push(`l -${i+1} 0`);
					pontos.push(`l ${i+1} ${i+1}`);
					pontos.push(`l ${i+1} -${i+1}`);
					pontos.push(`l -${i+1} 0`);
				}
			}else if(settings.trianguloFill == 'decrescente'){
				for(let i = 0; i <= 10; i++){ 
					pontos.push(`l -${10-i} 0`);
					pontos.push(`l ${10-i} ${10-i}`);
					pontos.push(`l ${10-i} -${10-i}`);
					pontos.push(`l -${10-i} 0`);
				}
			} else{
				pontos.push(`l -10 0`);
				pontos.push(`l 10 10`);
				pontos.push(`l 10 -10`);
				pontos.push(`l -10 0`);
			}
			path.setAttribute("d", pontos.join(" "));
			circle.setAttribute("d", pontosCirculo.join(" "));
			}else if(settings.tipoReta == 'complexa'){
				//height está certo!
				svg.setAttribute("height", `${distanciaVertical + settings.espessura + settings.offSetComplexo.ajusteTamanhoLinhaVertical + 2*settings.espessura + 2*settings.raio + 10 }px`);
				let linhaFinal = Math.abs(pos2.left - (window.innerWidth - settings.offSetComplexo.ajusteLimiteTelaLateral*window.innerWidth/100)+ settings.offSetComplexo.ajusteHorizontalUltimaLinha*window.innerWidth/100);
				svg.style.top = `${pos1.top}px`;
				let distanciaBordaCorrigida = window.innerWidth - pos1.left - settings.offSetComplexo.ajusteLimiteTelaLateral*window.innerWidth/100;
				svg.style.marginLeft = `${pos1.left - distanciaHorizontal - 16 - settings.espessura}px`;
			svg.setAttribute("width", `calc(100% - ${pos1.left - distanciaHorizontal - 14 - settings.espessura}px)`);
				
				let pontosCirculo = [
				`M ${distanciaHorizontal + 13} ${settings.espessura}`,
				`a ${settings.raio} ${settings.raio} 1 1 1 0 ${2*settings.raio}`,
				`M ${distanciaHorizontal + 13} ${settings.espessura}`,
				`a ${settings.raio} ${settings.raio} 1 1 0 0 ${2*settings.raio}`,
				];
				
				 let pontos = [
				`M ${distanciaHorizontal + 13} ${settings.espessura + 2*settings.raio}`,
				`l 0 ${settings.offSetComplexo.tamanhoLinhaInicial}`,
				`l ${distanciaBordaCorrigida} 0`,
				`l 0 ${pos2.top - pos1.top - settings.offSetComplexo.tamanhoLinhaInicial + settings.offSetComplexo.ajusteTamanhoLinhaVertical}`,
				`l -${linhaFinal} 0`, 				
			];
				//rolou e está legal
				if(settings.trianguloFill == 'crescente'){
				for(let i = 0; i <= 9; i++){
					pontos.push(`l 0 -${i+1}`);
					pontos.push(`l -${i+1} ${i+1}`);
					pontos.push(`l ${i+1} ${i+1}`);
					pontos.push(`l 0 -${i+1}`);
				}
			}else if(settings.trianguloFill == 'decrescente'){
				for(let i = 0; i <= 10; i++){ 
					pontos.push(`l 0 -${10-i}`);
					pontos.push(`l -${10-i} ${10-i}`);
					pontos.push(`l ${10-i} ${10-i}`);
					pontos.push(`l 0 -${10-i}`);
				}
			} else{
				pontos.push(`l 0 -10`);
				pontos.push(`l -10 10`);
				pontos.push(`l 10 10`);
				pontos.push(`l 0 -10`);
			}
				circle.setAttribute("d", pontosCirculo.join(" "));
				path.setAttribute("d", pontos.join(" "));
			}  else if(settings.tipoReta == 'complexaDeitada'){
				//height está certo!
				svg.setAttribute("height", `${distanciaVertical + settings.espessura + settings.offSetComplexo.ajusteTamanhoLinhaVertical + 2*settings.espessura + 2*settings.raio + 10 }px`);
				
				
				let linhaFinal = Math.abs(pos2.left - settings.offSetComplexo.ajusteHorizontalUltimaLinha*window.innerWidth/100);
				let auxHeight = distanciaVertical + settings.espessura + settings.offSetComplexo.ajusteTamanhoLinhaVertical + 2*settings.espessura + 2*settings.raio + 10;
				svg.style.top = `${pos2.top}px`;
				let distanciaBordaCorrigida = window.innerWidth - pos1.left - settings.offSetComplexo.ajusteLimiteTelaLateral*window.innerWidth/100;
				svg.style.marginLeft = `${pos1.left - distanciaHorizontal - 16 - settings.espessura}px`;
			svg.setAttribute("width", `calc(100% - ${pos1.left - distanciaHorizontal - 14 - settings.espessura}px)`);
				let pontosCirculo = [
				`M ${distanciaHorizontal + 13} ${-settings.espessura + auxHeight - 2*settings.raio}`,
				`a ${settings.raio} ${settings.raio} 1 1 1 0 ${2*settings.raio}`,
				`M ${distanciaHorizontal + 13} ${-settings.espessura + auxHeight - 2*settings.raio}`,
				`a ${settings.raio} ${settings.raio} 1 1 0 0 ${2*settings.raio}`,
				];
				
				 let pontos = [
					 
				`M ${distanciaHorizontal +13 + settings.raio} ${-settings.espessura + auxHeight - 1*settings.raio}`,
				`l ${distanciaHorizontal/2} 0`,
				`l 0 -${distanciaVertical}`,
				`l ${distanciaHorizontal/2 -13} 0`,
				
			];
				//rolou e está legal
				
				if(settings.trianguloFill == 'crescente'){
				for(let i = 0; i <= 9; i++){
					pontos.push(`l 0 -${i+1}`);
					pontos.push(`l ${i+1} ${i+1}`);
					pontos.push(`l -${i+1} ${i+1}`);
					pontos.push(`l 0 -${i+1}`);
				}
			}else if(settings.trianguloFill == 'decrescente'){
				for(let i = 0; i <= 10; i++){ 
					pontos.push(`l 0 -${10-i}`);
					pontos.push(`l ${10-i} ${10-i}`);
					pontos.push(`l -${10-i} ${10-i}`);
					pontos.push(`l 0 -${10-i}`);
				}
			} else{
				pontos.push(`l 0 -10`);
				pontos.push(`l 10 10`);
				pontos.push(`l -10 10`);
				pontos.push(`l 0 -10`);
			
				
			}
				circle.setAttribute("d", pontosCirculo.join(" "));
				path.setAttribute("d", pontos.join(" "));
			}else if(settings.tipoReta == 'complexaFull'){
				//height está certo!
				svg.setAttribute("height", `${distanciaVertical + settings.espessura + settings.offSetComplexo.ajusteTamanhoLinhaVertical + 2*settings.espessura + 2*settings.raio + 10 }px`);
				let linhaFinal = Math.abs(pos2.left - (window.innerWidth - settings.offSetComplexo.ajusteLimiteTelaLateral*window.innerWidth/100) + settings.offSetComplexo.ajusteHorizontalUltimaLinha*window.innerWidth/100);
				svg.style.top = `${pos1.top}px`;
				let distanciaBordaCorrigida = window.innerWidth - pos1.left - settings.offSetComplexo.ajusteLimiteTelaLateral*window.innerWidth/100;
				svg.style.marginLeft = `${0}px`;
			svg.setAttribute("width", `100%`);
				let pontosCirculo = [
				`M ${distanciaHorizontal + 13} ${settings.espessura}`,
				`a ${settings.raio} ${settings.raio} 1 1 1 0 ${2*settings.raio}`,
				`M ${distanciaHorizontal + 13} ${settings.espessura}`,
				`a ${settings.raio} ${settings.raio} 1 1 0 0 ${2*settings.raio}`,
				];
				
				 let pontos = [
				`M ${distanciaHorizontal + 13 + settings.raio} ${+settings.espessura  + settings.raio}`,
				`l 0 ${settings.offSetComplexo.tamanhoLinhaInicial}`,
				`l ${distanciaBordaCorrigida} 0`,
				`l 0 ${pos2.top - pos1.top - settings.offSetComplexo.tamanhoLinhaInicial + settings.offSetComplexo.ajusteTamanhoLinhaVertical}`,
				`l -${linhaFinal} 0`, 				
			];
				//rolou e está legal
				
				if(settings.trianguloFill == 'crescente'){
				for(let i = 0; i <= 9; i++){
					pontos.push(`l 0 -${i+1}`);
					pontos.push(`l -${i+1} ${i+1}`);
					pontos.push(`l ${i+1} ${i+1}`);
					pontos.push(`l 0 -${i+1}`);
				}
			}else if(settings.trianguloFill == 'decrescente'){
				for(let i = 0; i <= 10; i++){ 
					pontos.push(`l 0 -${10-i}`);
					pontos.push(`l -${10-i} ${10-i}`);
					pontos.push(`l ${10-i} ${10-i}`);
					pontos.push(`l 0 -${10-i}`);
				}
			} else{
				pontos.push(`l 0 -10`);
				pontos.push(`l -10 10`);
				pontos.push(`l 10 10`);
				pontos.push(`l 0 -10`);
			}
				circle.setAttribute("d", pontosCirculo.join(" "));
				path.setAttribute("d", pontos.join(" "));
			}
			svgs.forEach(function(item) {
				let svg = item.svg;
				if(item.animacao != 'never'){ 
					if(item.animacao == 'once' && item.cont >= 1 || item.animacao == 'ever'){
						let svgRect = svg.getBoundingClientRect();
						let isSVGVisible = !(
							svgRect.right < 0 ||
							svgRect.left > window.innerWidth ||
							svgRect.bottom < 0 ||
							svgRect.top > window.innerHeight
						);
						if (isSVGVisible) {
							svg.style.strokeDasharray = '5000';
							svg.style.strokeDashoffset = '5000';
							//svg.style.webkitAnimation = `dash ${settings.tempoAnimacao}s linear forwards`;
							//svg.style.animation = `dash ${settings.tempoAnimacao}s linear forwards`;
							svg.style.webkitAnimation = 'dash 12s linear forwards';
							svg.style.animation = 'dash 12s linear forwards';
							item.cont = item.cont - 1; 
						} else if (!isSVGVisible) {
							svg.style.webkitAnimation = '';
							svg.style.animation = '';
						}
					}
				}
			});
		}
		window.addEventListener("resize", handleResize);
		window.addEventListener("scroll", handleResize);
		handleResize();
	}
	
	// Exemplos de uso da função createSVG
	//execution - ambition |Computador| 
	createSVG(".elemento1", ".elemento2", {
		posicaoElemento1: 'central',
		posicaoElemento2: 'central',
		offSetsComputador: {
			vertical1: 10,
			horizontal1Percent: 6,
			vertical2: 0,
			horizontal2Percent: -7
		},
		cor: '#F9AD03',
		espessura: 1.5,
		raio: 5,
		animacao: 'ever',
		tipoReta: 'inteira',
		trianguloFill: 'crescente',
		colorFillCircle: '#FFFFFF',
		viewInPhone: false,
		viewInTablet: false,
		viewInLaptop: false,
	});
	
	//execution - ambition |Laptop|
	createSVG(".elemento1", ".elemento2Laptop", {
		posicaoElemento1: 'central',
		posicaoElemento2: 'esquerda',
		offSetsComputador: {
			vertical1: 3,
			horizontal1Percent: 0,
			vertical2: 0,
			horizontal2Percent: 10
		},
		cor: '#F9AD03',
		espessura: 1.5,
		raio: 5,
		animacao: 'ever',
		tipoReta: 'inteira',
		trianguloFill: 'crescente',
		colorFillCircle: '#FFFFFF',
		viewInPhone: false,
		viewInTablet: false,
		viewInComputer: false,
	});
	
	//execution - ambition |Celular e Tablet|
	createSVG(".elemento1", ".elemento2", {
		posicaoElemento1: 'central',
		posicaoElemento2: 'direita',
		offSetsCelular: {
			vertical1: 3,
			horizontal1Percent: 0,
			vertical2: 0,
			horizontal2Percent: 5.5
		},
		cor: '#F9AD03',
		espessura: 1.5,
		raio: 5,
		animacao: 'ever',
		tipoReta: 'complexa',
		trianguloFill: 'crescente',
		colorFillCircle: '#FFFFFF',
		offSetLinhaCentral: 0,
		offSetComplexo: {
				tamanhoLinhaInicial : 40,
				ajusteLimiteTelaLateral : 3,
				ajusteTamanhoLinhaVertical: 10,
				ajusteHorizontalUltimaLinha: 0,
		},
		viewInComputer: false,
		viewInLaptop: false,
		
	});
	
	//growth - unleash |Celular, Tablet, Laptop e Computador| (Perfeito)
	createSVG(".elemento3", ".elemento4", {
		posicaoElemento1: 'central',
		posicaoElemento2: 'esquerda',
		offSetsComputador: {
			vertical1: 4,
			horizontal1Percent: 3.5,
			vertical2: -8,
			horizontal2Percent: 13
		},
		offSetsCelular: {
			vertical1: 3,
			horizontal1Percent: 0,
			vertical2: 0,
			horizontal2Percent: 7
		},
		cor: '#F9AD03',
		espessura: 1.5,
		raio: 5,
		animacao: 'ever',
		retaPura: false,
		trianguloFill: 'crescente',
		colorFillCircle: '#FFFFFF',
		offSetLinhaCentralComputer: -30,	
	});
	
	//Potential - Team |Computador| Computador menor que 1111 o texto quebra e a seta fica ruim
	createSVG(".elemento5", ".elemento6", {
		posicaoElemento1: 'central',
		posicaoElemento2: 'esquerda',
		offSetsComputador: {
			vertical1: 10,
			horizontal1Percent: 0,
			vertical2: -10,
			horizontal2Percent: 4
		},
			
		cor: '#F9AD03',
		espessura: 1.5,
		raio: 5,
		animacao: 'ever',
		trianguloFill: 'crescente',
		colorFillCircle: '#FFFFFF',
		offSetLinhaCentralComputer: 5,
		viewInPhone: false,
		viewInTablet: false, 
		viewInLaptop: false
	});
	
	//Potential - Team |Celular, Tablet e Laptop| 
	createSVG(".elemento5", ".elemento6", {
		posicaoElemento1: 'direita',
		posicaoElemento2: 'esquerda',
		offSetsCelular: {
			vertical1: -55,
			horizontal1Percent:7,
			vertical2: 0,
			horizontal2Percent: 0
		},
		offSetsComputador: {
			vertical1: -55,
			horizontal1Percent: 3,
			vertical2: 12,
			horizontal2Percent: 0
		},
		tipoReta: 'complexaFull',
		offSetComplexo: {
				tamanhoLinhaInicial : 0,
				ajusteLimiteTelaLateral : 8,
				ajusteTamanhoLinhaVertical: 10,
				ajusteHorizontalUltimaLinha: 25,
		},
		cor: '#F9AD03',
		espessura: 1.5,
		raio: 5,
		animacao: 'ever',
		trianguloFill: 'crescente',
		colorFillCircle: '#FFFFFF',
		offSetLinhaCentralComputer: 0,
		viewInComputer: false,
		faixaBloqueio : {
				superior: 1799,
				inferior: 1601
			}
	});
	
	//Opportunities - execution |Celular, Tablet, Laptop e computador| (Perfeito)
	createSVG(".elemento7", ".elemento8", {
		posicaoElemento1: 'central',
		posicaoElemento2: 'esquerda',
		offSetsComputador: {
			vertical1: 3,
			horizontal1Percent: 0,
			vertical2: 0,
			horizontal2Percent: 10
		},
		offSetsCelular: {
			vertical1: 3,
			horizontal1Percent: -2,
			vertical2: 5,
			horizontal2Percent: 8
		},
		cor: '#F9AD03',
		espessura: 1.5,
		raio: 5,
		animacao: 'ever',
		trianguloFill: 'crescente',
		colorFillCircle: '#FFFFFF',
		offSetLinhaCentralComputer: 40,
	});
	
	// Growth - Impactfull |Celular e Computador| Certo
	createSVG(".elemento9", ".elemento10", {
		posicaoElemento1: 'central',
		posicaoElemento2: 'esquerda',
		offSetsComputador: {
			vertical1: 10,
			horizontal1Percent: 5,
			vertical2: 0,
			horizontal2Percent: 10
		},
		offSetsCelular: {
			vertical1: 3,
			horizontal1Percent: 6,
			vertical2: 0,
			horizontal2Percent: 4
		},
		cor: '#F9AD03',
		espessura: 1.5,
		raio: 5,
		animacao: 'ever',
		trianguloFill: 'crescente',
		colorFillCircle: '#FFFFFF',
	});
	
	// Capital - Growth |Computador e Laptop|
	createSVG(".elemento11", ".elemento12", {
		posicaoElemento1: 'central',
		posicaoElemento2: 'esquerda',
		offSetsComputador: {
			vertical1: -65,
			horizontal1Percent: 19,
			vertical2: 5,
			horizontal2Percent: -0.5
		},
		trianguloFill: 'crescente',
		cor: '#F9AD03',
		espessura: 1.5,
		raio: 5,
		animacao: 'ever',
		tipoReta: 'complexaDeitada',
		colorFillCircle: '#FFFFFF',
		offSetLinhaCentral: 0,
		offSetComplexo: {
				tamanhoLinhaInicial : 40,
				ajusteLimiteTelaLateral : 5,
				ajusteTamanhoLinhaVertical: 15,
				ajusteHorizontalUltimaLinha: 30,
		},
		viewInPhone: false,
		viewInTablet: false,
	});
	
	// Capital - Growth |Celular e Tablet|
	createSVG(".elemento11", ".elemento12", {
		posicaoElemento1: 'esquerda',
		posicaoElemento2: 'direita',
		offSetsCelular: {
			vertical1: -7,
			horizontal1Percent: 10,
			vertical2: 0,
			horizontal2Percent: -28
		},
		trianguloFill: 'crescente',
		cor: '#F9AD03',
		espessura: 1.5,
		raio: 5,
		animacao: 'ever',
		tipoReta: 'inteira',
		colorFillCircle: '#FFFFFF',
		offSetLinhaCentral: 0,
		viewInComputer: false,
		viewInLaptop: false
		
	});
	
	//Destination - Insvestment |Celular, Tablet, Laptop e Computador|
	createSVG(".elemento13", ".elemento14", {
		posicaoElemento1: 'central',
		posicaoElemento2: 'esquerda',
		offSetsComputador: {
			vertical1: 10,
			horizontal1Percent: 0,
			vertical2: 130,
			horizontal2Percent: 12
		},
		offSetsCelular: {
			vertical1: 5,
			horizontal1Percent:1.5,
			vertical2: 150,
			horizontal2Percent: 12
		},
		cor: '#F9AD03',
		espessura: 1.5,
		raio: 5,
		animacao: 'ever',
		retaPura: false,
		trianguloFill: 'crescente',
		colorFillCircle: '#FFFFFF',
		offSetLinhaCentralComputer: 40,
	});
});
