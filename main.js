jQuery(document).ready(function( $ ){
	let svgs = [];
	
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
			cor: '#000000',
			espessura: 2,
			raio: 3,
			animacao: 'ever',
			retaPura: false,
			trianguloFill: 'crecente',
			colorFillCircle: '#000000',
			offSetLinhaCentral: 0,
			viewInPhone: true,
			viewInComputer: true
		};
		
		let settings = Object.assign({}, defaults, options);
		
		let elemento1 = document.querySelector(element1Selector);
		let elemento2 = document.querySelector(element2Selector);
		let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.style.top = "0";
		svg.style.left = "0";
		svg.style.position = "absolute";
		svg.style.zIndex = "20";
		
		let circle = document.createElementNS("http://www.w3.org/2000/svg", "path");
		circle.setAttribute("stroke-width", settings.espessura);
		circle.setAttribute('stroke', settings.cor);
		circle.setAttribute("fill", settings.colorFillCircle); 
		svg.appendChild(circle);
		
		let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute("stroke-width", settings.espessura);
		path.setAttribute("fill", "none");
		path.setAttribute('stroke', settings.cor);
		svg.appendChild(path);
		
		document.body.appendChild(svg);
		
		if(settings.animacao !== 'never'){
			svg.style.strokeDasharray = '10000';
			svg.style.strokeDashoffset = '10000';
			svg.style.webkitAnimation = 'dash 23s linear forwards';
			svg.style.animation = 'dash 23s linear forwards';
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
			if (!settings.viewInPhone && window.innerWidth < 768 || !settings.viewInComputer && window.innerWidth >= 768){
			svg.style.visibility = "hidden";
			svg.style.zIndex = "-3";
			return
			}else{
				svg.style.visibility = "visible";
				svg.style.zIndex = "20";
			}
			let offSets =  {};
			if(window.innerWidth < 768){
				offSets = settings.offSetsCelular;
			}else{
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
			if(settings.retaPura){
				 let pontos = [
				`M ${distanciaHorizontal + 12} ${settings.espessura}`,
				`l 0 ${meioVertical + settings.offSetLinhaCentral}`,
				`l ${pos2.left > pos1.left ? distanciaHorizontal - settings.espessura : -distanciaHorizontal + settings.espessura} 0`,
				`l 0 ${pos2.top - pos1.top - meioVertical - settings.offSetLinhaCentral -15}`,
			];
				 path.setAttribute("d", pontos.join(" "));
			}else{
				let pontosCirculo = [
				`M ${distanciaHorizontal + 13} ${settings.espessura}`,
				`a ${settings.raio} ${settings.raio} 1 1 1 0 ${2*settings.raio}`,
				`M ${distanciaHorizontal + 13} ${settings.espessura}`,
				`a ${settings.raio} ${settings.raio} 1 1 0 0 ${2*settings.raio}`,
				];
				let auxiliar = pos2.left > pos1.left ? distanciaHorizontal - settings.espessura : - distanciaHorizontal + settings.espessura; 
				let pontos = [
				`M ${distanciaHorizontal + 13} ${settings.espessura + 2*settings.raio}`,
				`l 0 ${meioVertical + settings.offSetLinhaCentral - settings.raio}`,
				`l ${pos2.left > pos1.left ? distanciaHorizontal - settings.espessura : -distanciaHorizontal + settings.espessura} 0`,
				`l 0 ${pos2.top - pos1.top - meioVertical -15 - settings.offSetLinhaCentral - settings.raio}`,       
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
							svg.style.strokeDasharray = '10000';
							svg.style.strokeDashoffset = '10000';
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
	createSVG(".elemento1", ".elemento2", {
		posicaoElemento1: 'central',
		posicaoElemento2: 'esquerda',
		offSetsComputador: {
			vertical1: 10,
			horizontal1Percent: 2,
			vertical2: 35,
			horizontal2Percent: 6.5
		},
		offSetsCelular: {
			vertical1: 0,
			horizontal1Percent: 5,
			vertical2: 13,
			horizontal2Percent: 7
		},
		cor: '#F9AD03',
		espessura: 1.5,
		raio: 5,
		animacao: 'ever',
		retaPura: false,
		trianguloFill: 'crescente',
		colorFillCircle: '#FFFFFF',
		offSetLinhaCentral: 0
	});
	createSVG(".elemento3", ".elemento4", {
		posicaoElemento1: 'central',
		posicaoElemento2: 'esquerda',
		offSetsComputador: {
			vertical1: -5,
			horizontal1Percent: 3.5,
			vertical2: 160,
			horizontal2Percent: 18.5
		},
		cor: '#F9AD03',
		espessura: 1.5,
		raio: 5,
		animacao: 'ever',
		retaPura: false,
		trianguloFill: 'crescente',
		colorFillCircle: '#FFFFFF',
		offSetLinhaCentral: -100,
		viewInPhone: false
	});
	createSVG(".elemento3", ".elemento4", {
		posicaoElemento1: 'central',
		posicaoElemento2: 'esquerda',
		offSetsCelular: {
			vertical1: 0,
			horizontal1Percent: 0,
			vertical2: 130,
			horizontal2Percent: 25
		},
		cor: '#F9AD03',
		espessura: 1.5,
		raio: 5,
		animacao: 'ever',
		retaPura: false,
		trianguloFill: 'crescente',
		colorFillCircle: '#FFFFFF',
		offSetLinhaCentral: 0,
		viewInComputer: false
	});
	createSVG(".elemento5", ".elemento6", {
		posicaoElemento1: 'esquerda',
		posicaoElemento2: 'esquerda',
		offSetsComputador: {
			vertical1: -10,
			horizontal1Percent: 6,
			vertical2: -30,
			horizontal2Percent: 18.5
		},
		offSetsCelular: {
			vertical1: 10,
			horizontal1Percent: 2,
			vertical2: 10,
			horizontal2Percent: 5
		},
		cor: '#F9AD03',
		espessura: 1.5,
		raio: 5,
		animacao: 'ever',
		retaPura: false,
		trianguloFill: 'crescente',
		colorFillCircle: '#FFFFFF',
		offSetLinhaCentral: 120,
		viewInPhone: false,
	});
});
