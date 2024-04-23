jQuery(document).ready(function( $ ){
	let svgs = [];
	function createSVG(element1Selector, element2Selector, posicaoElemento1 = 'central', posicaoElemento2 = 'central', offSetVertical1 = 0, offSetHorizontal1 = 0, offSetVertical2 = 0, offSetHorizontal2 = 0, cor = '#000000', espessura = 2, raio = 3, animacao = 'ever', retaPura= false){ 
	 if (posicaoElemento1 === undefined) posicaoElemento1 = 'central';
	 if (posicaoElemento2 === undefined) posicaoElemento2 = 'central';
	 if (offSetHorizontal1 === undefined) offSetHorizontal1 = 0;
	 if (offSetHorizontal2 === undefined) offSetHorizontal2 = 0;
	 if (offSetVertical1 === undefined) offSetVertical1 = 0;
	 if (offSetVertical2 === undefined) offSetVertical2 = 0;
	 if (cor === undefined) cor = '#000000'; 
	 if (espessura === undefined) espessura = 2; 
	 if (raio === undefined) raio = 3; 
	 if (animacao === undefined) animacao = 'ever'; //once e never
	 if (retaPura === undefined) retaPura = false; 
		let elemento1 = document.querySelector(element1Selector);
		let elemento2 = document.querySelector(element2Selector);
   		let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.style.top = "0";
			svg.style.left = "0";
			svg.style.position = "absolute";
    		svg.style.zIndex = "20";
	
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke-width", espessura);
    path.setAttribute("fill", "none");
    path.setAttribute('stroke', cor);
   	svg.appendChild(path);
	document.body.appendChild(svg);
	svgs.push({ svg: svg, animacaoAtiva: false });
function handleResize() {
        let dimensoes1 = elemento1.getBoundingClientRect();
        let dimensoes2 = elemento2.getBoundingClientRect();
        let pos1 = {
            top: dimensoes1.bottom + window.scrollY + offSetVertical1,
            left: posicaoElemento1 == 'esquerda' ? dimensoes1.left + offSetHorizontal1 : posicaoElemento1 == 'direita' ? dimensoes1.left + dimensoes1.width + offSetHorizontal1 : dimensoes1.left + dimensoes1.width / 2 + offSetHorizontal1
        };
        let pos2 = {
            top: dimensoes2.top + window.scrollY + offSetVertical2,
            left: posicaoElemento2 == 'esquerda' ? dimensoes2.left + offSetHorizontal2 : posicaoElemento2 == 'direita' ? dimensoes2.left + dimensoes2.width + offSetHorizontal2 : dimensoes2.left + dimensoes2.width / 2 + offSetHorizontal2
        };
			let distanciaVertical = Math.abs(pos1.top - pos2.top);
			let distanciaHorizontal = Math.abs(pos1.left - pos2.left);
			let meioVertical = distanciaVertical / 2;
				svg.setAttribute("height", `${distanciaVertical + espessura}px`);
				svg.style.marginLeft = `${pos1.left - distanciaHorizontal - 16 - espessura}px`;
				svg.setAttribute("width", `calc(100% - ${pos1.left - distanciaHorizontal - 14 - espessura}px)`);
				svg.style.top = `${pos1.top}px`;
		if(retaPura){
			 let pontos = [
            `M ${distanciaHorizontal + 12} ${espessura -1}`,
            `l 0 ${meioVertical}`,
            `l ${pos2.left > pos1.left ? distanciaHorizontal - espessura : -distanciaHorizontal + espessura} 0`,
            `l 0 ${pos2.top - pos1.top - meioVertical -15}`,
        ];
			 path.setAttribute("d", pontos.join(" "));
		}else{
        let pontos = [
            `M ${distanciaHorizontal + 12} ${espessura -1}`,
            `a ${raio} ${raio} 1 1 1 0 ${2*raio}`,
            `M ${distanciaHorizontal + 12} ${espessura -1}`,
            `a ${raio} ${raio} 1 1 0 0 ${2*raio}`,
            `l 0 ${meioVertical - raio}`,
            `l ${pos2.left > pos1.left ? distanciaHorizontal - espessura : -distanciaHorizontal + espessura} 0`,
            `l 0 ${pos2.top - pos1.top - meioVertical -15 - raio}`,
            `l -10 0`,
            `l 10 10`,
            `l 10 -10`,
            `l -10 0`,
        ];
        path.setAttribute("d", pontos.join(" "));
   		}
	if(animacao != 'never'){
		console.log(animacao)
	 svgs.forEach(function(item) {
                let svg = item.svg;
                let svgRect = svg.getBoundingClientRect();
				let isSVGVisible = !(
					svgRect.right < 0 ||
					svgRect.left > window.innerWidth ||
					svgRect.bottom < 0 ||
					svgRect.top > window.innerHeight
				);
                
                if (isSVGVisible && !item.animacaoAtiva) {
                    item.animacaoAtiva = true;
					
                    svg.style.strokeDasharray = '10000';
					svg.style.strokeDashoffset = '10000';
					svg.style.webkitAnimation = 'dash 23s linear forwards';
					svg.style.animation = 'dash 23s linear forwards';
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
                } else if (!isSVGVisible && item.animacaoAtiva) {
                   item.animacaoAtiva = false;
                   let head = document.head || document.getElementsByTagName('head')[0];
      			   let styles = head.querySelectorAll('style');
      			   styles.forEach((style) => {
						if (style.innerHTML.includes('@keyframes dash')) {
						  head.removeChild(style);
						}
     			   });
                }
            });}
        }
        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleResize);
        handleResize();
    }
    
createSVG(".elemento1", ".elemento2",  'central', 'esquerda', 0, 30, -3, 80, '#F9AD03', 4, 5, 'ever', false);
createSVG(".elemento3", ".elemento4", 'central', 'esquerda', 0, 30, -3, 80, '#F9AD03', 4, 5, 'never', false);
//createSVG(".elemento5", ".elemento6", 'central', 'esquerda', 0, 30, -3, 80, '#F9AD03', 4, 5, 'never', false);

});
