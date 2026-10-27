// Dicionário offline espanhol → português.
//
// FREQUENT: palavras mais usadas do espanhol, em ordem aproximada de frequência
// (compilação própria, baseada em listas de frequência de corpus). A posição na lista
// é usada como "ranking". Formato: "palavra|tradução" (uma por linha).
// EXTRA: vocabulário das lições, textos e do mundo dos negócios/audiovisual.
//
// Para adicionar palavras: inclua linhas novas no bloco certo. Use a forma de
// dicionário (infinitivo, masculino singular); o app reconhece conjugações e plurais.

const FREQUENT = `
de|de
la|a (artigo)
que|que
el|o (artigo)
en|em
y|e
a|a, para
los|os
se|se
del|do
las|as
un|um
por|por
con|com
no|não
una|uma
su|seu, sua (dele/dela/de você)
para|para
es|é (ser)
al|ao
lo|o, isso
como|como
más|mais
o|ou
pero|mas
sus|seus, suas
le|lhe, a ele/ela
ha|tem, há (haber: verbo auxiliar)
me|me
si|se (condição)
sin|sem
sobre|sobre
este|este
ya|já
entre|entre
cuando|quando
todo|todo, tudo
esta|esta
ser|ser
son|são (ser)
dos|dois
también|também
fue|foi (ser/ir)
había|havia
era|era (ser)
muy|muito
año|ano
hasta|até
desde|desde
estar|estar
mi|meu, minha
porque|porque
qué|que, o quê
solo|só, apenas; sozinho
han|têm (haber: auxiliar)
yo|eu
hay|há, tem (existe)
vez|vez
poder|poder
todos|todos
así|assim
nos|nos, a gente
ni|nem
parte|parte
tener|ter
él|ele
uno|um
donde|onde
bien|bem
tiempo|tempo
mismo|mesmo
ese|esse
ahora|agora
cada|cada
vida|vida
otro|outro
después|depois
te|te
aunque|embora, ainda que
eso|isso
hacer|fazer
tan|tão
durante|durante
siempre|sempre
día|dia
tanto|tanto
ella|ela
tres|três
sí|sim
decir|dizer
gran|grande
país|país
según|segundo, conforme
menos|menos
mundo|mundo
antes|antes
contra|contra
sino|mas sim, senão
forma|forma, maneira
caso|caso
nada|nada
general|geral
poco|pouco
mayor|maior; mais velho
ante|diante de
unos|uns
algo|algo, alguma coisa
hoy|hoje
casa|casa
nosotros|nós
mucho|muito
ellos|eles
mujer|mulher
lugar|lugar
cosa|coisa
momento|momento
mientras|enquanto
ir|ir
dar|dar
nuevo|novo
pues|pois, então
ver|ver
saber|saber
querer|querer
último|último
primero|primeiro
hombre|homem
trabajo|trabalho
llegar|chegar
pasar|passar
deber|dever
creer|acreditar, achar
quedar|ficar; combinar (encontro)
poner|pôr, colocar
parecer|parecer
hablar|falar
llevar|levar; usar (roupa)
dejar|deixar; emprestar
seguir|seguir, continuar
encontrar|encontrar
llamar|chamar; ligar (telefone)
venir|vir
pensar|pensar
salir|sair
volver|voltar
tomar|tomar, pegar
conocer|conhecer
vivir|viver, morar
sentir|sentir
tratar|tratar; tentar
mirar|olhar
contar|contar
empezar|começar
esperar|esperar
buscar|procurar
existir|existir
entrar|entrar
trabajar|trabalhar
escribir|escrever
perder|perder
producir|produzir
ocurrir|ocorrer
entender|entender
pedir|pedir
recibir|receber
recordar|lembrar
terminar|terminar
permitir|permitir
aparecer|aparecer
conseguir|conseguir
comenzar|começar
servir|servir
sacar|tirar; sacar (dinheiro)
necesitar|precisar
mantener|manter
resultar|resultar
leer|ler
caer|cair
cambiar|mudar; trocar
presentar|apresentar
crear|criar
abrir|abrir
considerar|considerar
oír|ouvir
acabar|acabar
convertir|converter, transformar
ganar|ganhar
formar|formar
traer|trazer
partir|partir
morir|morrer
aceptar|aceitar
realizar|realizar
suponer|supor
comprender|compreender
lograr|conseguir, alcançar
explicar|explicar
preguntar|perguntar
tocar|tocar
reconocer|reconhecer
estudiar|estudar
alcanzar|alcançar
nacer|nascer
dirigir|dirigir
correr|correr
utilizar|utilizar
pagar|pagar
ayudar|ajudar
gustar|gostar (me gusta = eu gosto)
jugar|jogar; brincar
escuchar|escutar, ouvir
cumplir|cumprir; fazer (anos)
ofrecer|oferecer
descubrir|descobrir
levantar|levantar
intentar|tentar
usar|usar
decidir|decidir
repetir|repetir
olvidar|esquecer
valer|valer
comer|comer
mostrar|mostrar
ocupar|ocupar
mover|mover
continuar|continuar
suceder|acontecer
cerrar|fechar
preparar|preparar
dormir|dormir
vender|vender
comprar|comprar
subir|subir
bajar|descer; baixar
pertenecer|pertencer
señor|senhor
cuenta|conta
punto|ponto
persona|pessoa
manera|maneira
hecho|fato; feito
historia|história
mano|mão
ciudad|cidade
noche|noite
agua|água
problema|problema
grupo|grupo
tipo|tipo
idea|ideia
nombre|nome
familia|família
lado|lado
fin|fim
calle|rua
padre|pai
madre|mãe
hijo|filho
amigo|amigo
semana|semana
mes|mês
hora|hora
minuto|minuto
pregunta|pergunta
respuesta|resposta
palabra|palavra
gente|gente, pessoas
niño|criança, menino
empresa|empresa
mercado|mercado
dinero|dinheiro
precio|preço
sistema|sistema
servicio|serviço
programa|programa
proyecto|projeto
proceso|processo
información|informação
medio|meio
centro|centro
cambio|mudança; troco; câmbio
situación|situação
razón|razão
interés|interesse
nivel|nível
orden|ordem
relación|relação
sociedad|sociedade
política|política
economía|economia
desarrollo|desenvolvimento
estudio|estudo
universidad|universidade
clase|aula; classe
profesor|professor
estudiante|estudante
libro|livro
mesa|mesa
puerta|porta
coche|carro
tren|trem
avión|avião
viaje|viagem
camino|caminho
mañana|manhã; amanhã
tarde|tarde
fiesta|festa
comida|comida; almoço
cena|jantar
desayuno|café da manhã
café|café
leche|leite (la leche)
pan|pão
carne|carne
fruta|fruta
vino|vinho
cerveza|cerveja
música|música
película|filme
serie|série
libre|livre
fácil|fácil
difícil|difícil
importante|importante
posible|possível
propio|próprio
largo|comprido, longo
alto|alto
bajo|baixo
pequeño|pequeno
grande|grande
bueno|bom
malo|mau, ruim
mejor|melhor
peor|pior
nuevo|novo
viejo|velho
joven|jovem
claro|claro
cierto|certo
igual|igual
diferente|diferente
social|social
público|público
nacional|nacional
internacional|internacional
español|espanhol
europeo|europeu
primer|primeiro
segundo|segundo
tercero|terceiro
cuatro|quatro
cinco|cinco
seis|seis
siete|sete
ocho|oito
nueve|nove
diez|dez
cien|cem
mil|mil
millón|milhão
aquí|aqui
allí|ali, lá
ahí|aí
cerca|perto
lejos|longe
dentro|dentro
fuera|fora
arriba|em cima
abajo|embaixo
delante|na frente
detrás|atrás
encima|em cima
nunca|nunca
también|também
tampoco|também não
todavía|ainda
aún|ainda
casi|quase
quizás|talvez
bastante|bastante
demasiado|demais
además|além disso
incluso|inclusive, até
sobre todo|sobretudo
entonces|então
luego|depois, logo
pronto|cedo; logo
ayer|ontem
anoche|ontem à noite
alguien|alguém
nadie|ninguém
algún|algum
alguno|algum
ninguno|nenhum
cual|qual
quien|quem
cuánto|quanto
cómo|como
dónde|onde
cuándo|quando
por qué|por quê
usted|o senhor, a senhora, você (formal)
ustedes|os senhores, vocês (formal)
vosotros|vocês (informal, Espanha)
tú|você, tu
nuestro|nosso
vuestro|de vocês (informal)
tu|teu, seu (de você)
aquel|aquele
esto|isto
mí|mim
ti|ti
conmigo|comigo
contigo|contigo, com você
os|vos, vocês (objeto)
les|lhes, a eles
gracias|obrigado
hola|olá, oi
adiós|tchau, adeus
vale|ok, beleza
perdón|desculpa
favor|favor
sólo|só
haber|haver (auxiliar: he comido = comi)
buen|bom
mal|mal; mau
cualquier|qualquer
tal|tal
varios|vários
verdad|verdade
principal|principal
principio|princípio, começo
modelo|modelo
plan|plano
local|local
natural|natural
perfecto|perfeito
fuerte|forte
enorme|enorme
próximo|próximo
pleno|pleno
previo|prévio
obligatorio|obrigatório
simpático|simpático
corto|curto
antiguo|antigo
comercial|comercial
virtual|virtual
web|site, web
internet|internet
radio|rádio
noticia|notícia
horario|horário
invierno|inverno
verano|verão
primavera|primavera
otoño|outono
transporte|transporte
contexto|contexto
disposición|disposição
embargo|embargo (sin embargo = no entanto)
obstante|(no obstante = no entanto)
pesar|pesar (a pesar de = apesar de)
mediante|mediante, por meio de
ciento|cento (por ciento = por cento)
trescientos|trezentos
verbo|verbo
test|teste; tipo test = múltipla escolha
reality|reality show
streaming|streaming
lactosa|lactose
penicilina|penicilina
muro|muro
red|rede
bebida|bebida
casco|capacete; casco antiguo = centro histórico
actualizar|atualizar
basar|basear
comunicar|comunicar, informar
confirmar|confirmar
enviar|enviar
envío|envio; (eu) envio
mejorar|melhorar
proponer|propor
publicar|publicar
responder|responder
resolver|resolver
revisar|revisar
seleccionar|selecionar
soler|costumar
mantener|manter
jugar|jogar; brincar
rápidamente|rapidamente
profesora|professora
cuerpo|corpo
ojo|olho
cara|rosto, cara
voz|voz
corazón|coração
pie|pé
brazo|braço
pelo|cabelo
boca|boca
fuerza|força
guerra|guerra
paz|paz
muerte|morte
amor|amor
verdad|verdade
mente|mente
sentido|sentido
efecto|efeito
resultado|resultado
causa|causa
cuestión|questão
tema|tema, assunto
asunto|assunto
objeto|objeto
paso|passo
camino|caminho
fondo|fundo
final|final, fim
principio|princípio
tierra|terra
mar|mar
sol|sol
cielo|céu
aire|ar
fuego|fogo
árbol|árvore
campo|campo
calle|rua
edificio|prédio
oficina|escritório
habitación|quarto
cama|cama
ventana|janela
pared|parede
suelo|chão
silla|cadeira
coche|carro
ruido|barulho
sonido|som
imagen|imagem
foto|foto
carta|carta
papel|papel
nota|nota
lista|lista
número|número
cantidad|quantidade
parte|parte
mitad|metade
resto|resto
total|total
grado|grau
tamaño|tamanho
forma|forma
modo|modo
manera|maneira
medio|meio
fin|fim
base|base
norma|norma
ley|lei
derecho|direito
estado|estado
gobierno|governo
ministro|ministro
partido|partido; jogo
elección|eleição
voto|voto
poder|poder
autoridad|autoridade
policía|polícia
juez|juiz
guerra|guerra
ejército|exército
seguridad|segurança
peligro|perigo
riesgo|risco
crisis|crise
problema|problema
solución|solução
cambio|mudança
diferencia|diferença
relación|relação
contacto|contato
acuerdo|acordo
conflicto|conflito
apoyo|apoio
ayuda|ajuda
servicio|serviço
producto|produto
cliente|cliente
usuario|usuário
consumidor|consumidor
mercado|mercado
negocio|negócio
empresa|empresa
compañía|companhia
industria|indústria
sector|setor
banco|banco
precio|preço
valor|valor
coste|custo
beneficio|lucro; benefício
pérdida|perda
deuda|dívida
crecimiento|crescimento
capital|capital
inversión|investimento
venta|venda
compra|compra
pago|pagamento
salario|salário
empleo|emprego
trabajador|trabalhador
jefe|chefe
director|diretor
equipo|equipe
departamento|departamento
área|área
dirección|direção
gestión|gestão
control|controle
plan|plano
objetivo|objetivo
estrategia|estratégia
análisis|análise
estudio|estudo
investigación|pesquisa, investigação
dato|dado
cifra|número, cifra
porcentaje|porcentagem
media|média
nivel|nível
calidad|qualidade
cantidad|quantidade
tecnología|tecnologia
red|rede
medio|meio
medios|mídia, meios
comunicación|comunicação
mensaje|mensagem
noticia|notícia
prensa|imprensa
periodista|jornalista
artículo|artigo
página|página
texto|texto
libro|livro
lectura|leitura
idioma|idioma
lengua|língua
palabra|palavra
frase|frase
cultura|cultura
arte|arte
historia|história
ciencia|ciência
educación|educação
escuela|escola
curso|curso
alumno|aluno
maestro|professor (escola); mestre
conocimiento|conhecimento
experiencia|experiência
capacidad|capacidade
habilidad|habilidade
salud|saúde
enfermedad|doença
hospital|hospital
paciente|paciente
población|população
ciudadano|cidadão
persona|pessoa
gente|gente
pueblo|povo; vilarejo
región|região
zona|zona, área
espacio|espaço
lugar|lugar
sitio|lugar
punto|ponto
línea|linha
nivel|nível
época|época
siglo|século
fecha|data
historia|história
futuro|futuro
pasado|passado
presente|presente
momento|momento
rato|um tempinho
minuto|minuto
segundo|segundo
mañana|manhã; amanhã
tarde|tarde
noche|noite
fin de semana|fim de semana
vacaciones|férias
viaje|viagem
hotel|hotel
restaurante|restaurante
tienda|loja
precio|preço
regalo|presente
ropa|roupa
color|cor
blanco|branco
verde|verde
amarillo|amarelo
marrón|marrom
rosa|rosa
claro|claro
oscuro|escuro
caliente|quente
fresco|fresco
seco|seco
lleno|cheio
limpio|limpo
sucio|sujo
duro|duro
blando|mole
fuerte|forte
débil|fraco
rápido|rápido
lento|lento
fácil|fácil
simple|simples
complejo|complexo
completo|completo
entero|inteiro
único|único
solo|sozinho
juntos|juntos
distinto|distinto
parecido|parecido
igual|igual
contrario|contrário
cierto|certo
seguro|seguro, certo
falso|falso
verdadero|verdadeiro
real|real
actual|atual (falso amigo: atual)
reciente|recente
antiguo|antigo
moderno|moderno
próximo|próximo
anterior|anterior
posterior|posterior
siguiente|seguinte
principal|principal
básico|básico
central|central
necesario|necessário
suficiente|suficiente
capaz|capaz
libre|livre
feliz|feliz
triste|triste
contento|contente
preocupado|preocupado
enfadado|bravo, irritado
cansado|cansado
enfermo|doente
sano|saudável
listo|pronto; esperto
tonto|bobo
inteligente|inteligente
amable|gentil, amável
guapo|bonito (pessoa)
feo|feio
rico|rico; gostoso
pobre|pobre
caro|caro
barato|barato
famoso|famoso
popular|popular
propio|próprio
privado|privado
personal|pessoal
humano|humano
económico|econômico
político|político
cultural|cultural
digital|digital
global|global
local|local
regional|regional
mundial|mundial
europeo|europeu
americano|americano
latino|latino
extranjero|estrangeiro
alemán|alemão
francés|francês
chino|chinês
llamada|ligação, chamada
teléfono|telefone
ordenador|computador
pantalla|tela
aplicación|aplicativo
correo electrónico|e-mail
contraseña|senha
cuenta|conta
usuario|usuário
archivo|arquivo
carpeta|pasta
enlace|link
red social|rede social
mostrar|mostrar
explicar|explicar
indicar|indicar
señalar|apontar
afirmar|afirmar
asegurar|garantir, afirmar
añadir|acrescentar
comentar|comentar
anunciar|anunciar
informar|informar
contestar|responder
discutir|discutir
negar|negar
admitir|admitir
reconocer|reconhecer
proponer|propor
sugerir|sugerir
recomendar|recomendar
aconsejar|aconselhar
pedir|pedir
exigir|exigir
ordenar|ordenar, mandar
prohibir|proibir
permitir|permitir
aceptar|aceitar
rechazar|recusar, rejeitar
elegir|escolher
decidir|decidir
preferir|preferir
desear|desejar
esperar|esperar
soñar|sonhar
imaginar|imaginar
suponer|supor
dudar|duvidar
temer|temer
preocupar|preocupar
importar|importar
interesar|interessar
molestar|incomodar
encantar|encantar, adorar
gustar|gostar
odiar|odiar
amar|amar
querer|querer; amar
sentir|sentir
sufrir|sofrer
disfrutar|aproveitar, curtir
divertirse|divertir-se
reír|rir
llorar|chorar
sonreír|sorrir
mirar|olhar
observar|observar
notar|notar
escuchar|escutar
oler|cheirar
tocar|tocar
probar|provar
comer|comer
beber|beber
cocinar|cozinhar
dormir|dormir
despertar|acordar
levantarse|levantar-se
acostarse|deitar-se
ducharse|tomar banho
vestirse|vestir-se
lavar|lavar
limpiar|limpar
arreglar|consertar, arrumar
romper|quebrar
construir|construir
crear|criar
diseñar|projetar, desenhar
desarrollar|desenvolver
producir|produzir
fabricar|fabricar
vender|vender
comprar|comprar
pagar|pagar
cobrar|cobrar
gastar|gastar
ahorrar|economizar, poupar
invertir|investir
ganar|ganhar
perder|perder
deber|dever
costar|custar
valer|valer
cambiar|mudar, trocar
mejorar|melhorar
empeorar|piorar
aumentar|aumentar
reducir|reduzir
bajar|baixar, descer
subir|subir
crecer|crescer
caer|cair
desaparecer|desaparecer
aparecer|aparecer
surgir|surgir
nacer|nascer
morir|morrer
vivir|viver
existir|existir
quedar|ficar
quedarse|ficar, permanecer
estar|estar
encontrar|encontrar
buscar|procurar
perder|perder
olvidar|esquecer
recordar|lembrar
aprender|aprender
enseñar|ensinar
estudiar|estudar
saber|saber
conocer|conhecer
entender|entender
comprender|compreender
pensar|pensar
creer|achar, acreditar
considerar|considerar
analizar|analisar
comparar|comparar
evaluar|avaliar
medir|medir
calcular|calcular
contar|contar
sumar|somar
resolver|resolver
solucionar|solucionar
intentar|tentar
tratar|tratar; tentar
lograr|conseguir
conseguir|conseguir
alcanzar|alcançar
superar|superar
fallar|falhar
fracasar|fracassar
ganar|ganhar, vencer
competir|competir
participar|participar
colaborar|colaborar
cooperar|cooperar
compartir|compartilhar
ayudar|ajudar
apoyar|apoiar
defender|defender
proteger|proteger
cuidar|cuidar
atender|atender
servir|servir
ofrecer|oferecer
dar|dar
recibir|receber
entregar|entregar
enviar|enviar
mandar|mandar
llevar|levar
traer|trazer
coger|pegar
dejar|deixar
poner|pôr
meter|colocar dentro
sacar|tirar
abrir|abrir
cerrar|fechar
empezar|começar
comenzar|começar
iniciar|iniciar
terminar|terminar
acabar|acabar
continuar|continuar
seguir|seguir
parar|parar
detener|deter, parar
esperar|esperar
llegar|chegar
salir|sair
entrar|entrar
volver|voltar
regresar|regressar
venir|vir
ir|ir
andar|andar
caminar|caminhar
correr|correr
viajar|viajar
conducir|dirigir (carro)
volar|voar
subir|subir
pasar|passar
cruzar|atravessar
seguir|seguir
girar|virar
moverse|mover-se
quedarse|ficar
sentarse|sentar-se
levantar|levantar
tirar|jogar fora; puxar
empujar|empurrar
coger|pegar
agarrar|agarrar
mostrar|mostrar
enseñar|ensinar; mostrar
ver|ver
leer|ler
escribir|escrever
dibujar|desenhar
pintar|pintar
cantar|cantar
bailar|dançar
tocar|tocar
jugar|jogar
practicar|praticar
entrenar|treinar
ganar|ganhar
organizar|organizar
planificar|planejar
preparar|preparar
programar|programar
reservar|reservar
confirmar|confirmar
cancelar|cancelar
anular|anular
retrasar|atrasar
adelantar|adiantar
llamar|ligar, chamar
hablar|falar
decir|dizer
contar|contar
preguntar|perguntar
responder|responder
saludar|cumprimentar
despedirse|despedir-se
presentar|apresentar
conocerse|conhecer-se
casarse|casar-se
separarse|separar-se
mudarse|mudar-se
alquilar|alugar
compartir|dividir, compartilhar
`;

const EXTRA = `
máster|mestrado
asignatura|matéria, disciplina
apuntes|anotações (de aula)
diapositiva|slide
tutoría|horário de atendimento do professor
aprobar|passar (na prova); aprovar
suspender|reprovar; suspender
examen|prova, exame
nota|nota
trabajo final|trabalho de conclusão
entrega|entrega
entregar|entregar
aula|sala de aula
biblioteca|biblioteca
facultad|faculdade
campus|campus
bolígrafo|caneta
duda|dúvida
capítulo|capítulo
asistencia|presença; assistência
asistir|comparecer, assistir (a aula)
significar|significar
participación|participação
debatir|debater
analizar|analisar
compañero|colega, companheiro
compañera|colega, companheira
metro|metrô
estación|estação
línea|linha
transbordo|baldeação
parada|parada, ponto
andén|plataforma (de trem)
salida|saída
entrada|entrada
dirección|direção; endereço
tarjeta|cartão
abono|passe (de transporte)
recargar|recarregar
autobús|ônibus
búho|coruja; ônibus noturno (Madrid)
aeropuerto|aeroporto
billete|bilhete, passagem
lleno|cheio, lotado
vacío|vazio
obra|obra
tardar|demorar
equivocarse|errar, enganar-se
coger|pegar (transporte, objeto)
cercano|próximo
atasco|engarrafamento
rotonda|rotatória
bici|bicicleta
bicicleta|bicicleta
plaza|praça
esquina|esquina
recto|reto
derecha|direita
izquierda|esquerda
enfrente|em frente
girar|virar
cruzar|atravessar
andar|andar, caminhar
perderse|perder-se
ayuntamiento|prefeitura
museo|museu
farmacia|farmácia
barrio|bairro
turista|turista
bar|bar
caña|chope pequeno
pincho|petisco, porção individual
tortilla|tortilha (de batata)
cobrar|cobrar
zumo|suco
naranja|laranja
bocadillo|sanduíche (de pão baguete)
jamón|presunto (cru)
vaso|copo
grifo|torneira
invitar|convidar; pagar (para alguém)
recomendar|recomendar
rico|gostoso; rico
riquísimo|delicioso
cortado|café pingado
tostada|torrada
tomate|tomate
servicios|banheiro (público)
baño|banheiro; banho
camarero|garçom
gluten|glúten
kilo|quilo
fresa|morango
bolsa|sacola; bolsa (valores)
aceite|azeite, óleo
oliva|oliva
patata|batata
oferta|oferta, promoção
docena|dúzia
huevo|ovo
recién|recém
efectivo|dinheiro vivo; eficaz
queso|queijo
loncha|fatia
cuarto|quarto; um quarto (1/4)
serrano|serrano
súper|supermercado
cerrar|fechar
manzana|maçã; quarteirão
caro|caro
barato|barato
hora|hora
media|meia
cuarto|quarto
cumpleaños|aniversário
lunes|segunda-feira
martes|terça-feira
miércoles|quarta-feira
jueves|quinta-feira
viernes|sexta-feira
sábado|sábado
domingo|domingo
enero|janeiro
febrero|fevereiro
marzo|março
abril|abril
mayo|maio
junio|junho
julio|julho
agosto|agosto
septiembre|setembro
octubre|outubro
noviembre|novembro
diciembre|dezembro
quince|quinze
veinte|vinte
veintiséis|vinte e seis
veintiocho|vinte e oito
treinta|trinta
cuarenta|quarenta
cincuenta|cinquenta
ochenta|oitenta
noventa|noventa
cien|cem
trescientos|trezentos
cuatrocientos|quatrocentos
setecientos|setecentos
novecientos|novecentos
móvil|celular
alquiler|aluguel
euro|euro
calor|calor
frío|frio
sierra|serra
nacer|nascer
piso|apartamento; andar
habitación|quarto
compartido|compartilhado
compartir|compartilhar, dividir
gasto|gasto; contas (do apartamento)
incluido|incluído
fianza|caução
exterior|exterior; que dá para a rua
luz|luz
ascensor|elevador
casero|senhorio, dono do imóvel; caseiro
contestar|responder
mensaje|mensagem
romper|quebrar
calefacción|aquecimento
durar|durar
contrato|contrato
empadronarse|registrar-se no padrón (endereço)
empadronamiento|registro de endereço (padrón)
majo|simpático, gente boa
comunicado|comunicado; servido (de transporte)
tranquilo|tranquilo
admitir|admitir, aceitar
mascota|animal de estimação
dividir|dividir
factura|conta, fatura
cocina|cozinha
amueblado|mobiliado
mudarse|mudar-se
aval|fiador, garantia
demanda|demanda
médico|médico
cita|consulta, horário marcado; encontro
cabecera|cabeceira (médico de cabecera = clínico geral)
doler|doer
cabeza|cabeça
fiebre|febre
tos|tosse
constipado|resfriado (falso amigo!)
estreñido|com prisão de ventre
garganta|garganta
dolor|dor
alérgico|alérgico
receta|receita
medicamento|remédio
pastilla|comprimido
guardia|plantão; guarda
torcer|torcer
tobillo|tornozelo
sanitario|sanitário, de saúde
encontrarse|sentir-se; encontrar-se
urgencias|pronto-socorro
embarazada|grávida (falso amigo!)
picar|picar
mosquito|mosquito
banco|banco
bancario|bancário
documento|documento
pasaporte|passaporte
comisión|comissão; tarifa
mantenimiento|manutenção
transferencia|transferência
número|número
cajero|caixa eletrônico; caixa (pessoa)
tragar|engolir
cobrado|cobrado
bizum|Bizum (pagamento instantâneo, tipo Pix)
nómina|holerite, salário
bloquear|bloquear
domiciliar|colocar em débito automático
recibo|recibo; conta (luz, água)
firmar|assinar
sucursal|agência (bancária)
real|real (moeda); real
perdonar|perdoar, desculpar
cita previa|agendamento
huella|impressão digital; pegada
solicitar|solicitar
faltar|faltar
certificado|certificado
rellenar|preencher
formulario|formulário
fotocopia|cópia, xerox
tasa|taxa
visado|visto
caducar|vencer (prazo/validade)
traer|trazer
papel|papel
ventanilla|guichê; janela (de veículo)
atender|atender
turno|vez; turno
listo|pronto (estar); esperto (ser)
sellar|carimbar
disponible|disponível
alta|alta; inscrição (darse de alta)
seguridad social|seguridade social
trámite|trâmite, procedimento
plazo|prazo
probar|provar, experimentar
probador|provador
talla|tamanho (roupa)
quedar|ficar (roupa); combinar
apretar|apertar
zapato|sapato
vaqueros|calça jeans
costar|custar
devolver|devolver
tique|recibo, cupom
rebajas|liquidação
abrigo|casaco
llevarse|levar (comprar)
negro|preto
chaqueta|jaqueta
algodón|algodão
descuento|desconto
centro comercial|shopping
abierto|aberto
camisa|camisa
gustos|gostos
encantar|adorar, encantar
nada|nada
madrugar|acordar cedo
rastro|rastro; feira do Rastro (Madrid)
preferir|preferir
playa|praia
montaña|montanha
interesar|interessar
fotografía|fotografia
pádel|pádel (esporte)
aprender|aprender
cocinar|cozinhar
aburrir|entediar
aburrido|chato (ser); entediado (estar)
apetecer|estar a fim, dar vontade
concierto|show, concerto
odiar|odiar
cola|fila; cola; rabo
fútbol|futebol
cine|cinema
teatro|teatro
hermana|irmã
hermano|irmão
padres|pais
moreno|moreno
contento|contente
cariñoso|carinhoso
prima|prima
casado|casado
abuelo|avô
sobrino|sobrinho
nervioso|nervoso
bonito|bonito
quedamos|combinamos; nos encontramos
tapa|petisco; tampa
llegue|chegue (llegar)
empezad|comecem (vosotros)
guay|legal
apuntarse|entrar (num plano), inscrever-se
cansado|cansado
terraza|terraço; mesas na calçada de bar
oso|urso
placer|prazer
conocer|conhecer
desayunar|tomar café da manhã
nieve|neve
cenar|jantar
vivir|morar, viver
hiciste|você fez (hacer)
levantarse|levantar-se, acordar
productora|produtora
reservar|reservar
menú|cardápio; menu
gazpacho|gaspacho (sopa fria)
merluza|merluza (peixe)
postre|sobremesa
filete|filé, bife
hecho|feito; poco hecho = malpassado
salado|salgado
ración|porção
a medias|meio a meio
incluir|incluir
vegetariano|vegetariano
plato|prato
croqueta|croquete
exquisito|delicioso (falso amigo!)
propina|gorjeta (falso amigo!)
sal|sal (la sal)
repartir|dividir, distribuir
tarea|tarefa
encargarse|ficar responsável, cuidar de
reunirse|reunir-se
cafetería|cafeteria
mandar|mandar, enviar
correo|e-mail; correio
acuerdo|acordo (estar de acuerdo = concordar)
análisis|análise
fuente|fonte
conclusión|conclusão
estupendo|ótimo, excelente
retraso|atraso
prisa|pressa
chico|garoto, rapaz; pessoal (chicos)
adjuntar|anexar
adjunto|anexo; em anexo
ayuda|ajuda
saludo|saudação; cumprimento
cordial|cordial
estimado|prezado
consultar|consultar, tirar dúvida
agradecer|agradecer
espera|espera
comentario|comentário
criterio|critério
evaluación|avaliação
molestia|incômodo
sector|setor
audiovisual|audiovisual
productor|produtor
dedicarse|dedicar-se, trabalhar com
producción|produção
contenido|conteúdo
prácticas|estágio (falso amigo!)
agencia|agência
experiencia|experiência
edición|edição
vídeo|vídeo
puesto|cargo, posto
coordinador|coordenador
currículum|currículo
entrevista|entrevista
presupuesto|orçamento
rodaje|filmagem
autónomo|autônomo
punto fuerte|ponto forte
gestión|gestão
equipo|equipe; equipamento
estrategia|estratégia
sueldo|salário
negociable|negociável
jornada|jornada
semanal|semanal
indefinido|indefinido; por tempo indeterminado
reunión|reunião
conexión|conexão
cortar|cortar
añadir|acrescentar
opinión|opinião
enfoque|abordagem, enfoque
interrumpir|interromper
calma|calma
cumplir|cumprir
aplazar|adiar
enlace|link; conexão
videollamada|videochamada
lluvia de ideas|brainstorming
lluvia|chuva
campaña|campanha
lanzar|lançar
copia|cópia
estrenar|estrear
plataforma|plataforma
postproducción|pós-produção
guion|roteiro
audiencia|audiência, público
publicidad|publicidade
cadena|canal (de TV); cadeia
derecho|direito
montaje|montagem, edição
coproducción|coprodução
red social|rede social
clave|chave; fundamental
difusión|divulgação, difusão
periódico|jornal
directora|diretora
director|diretor
posicionamiento|posicionamento
marca|marca
subtítulo|legenda
emisora|emissora (de rádio)
líder|líder
cortometraje|curta-metragem
premio|prêmio
festival|festival
anunciante|anunciante
dato|dado
consumo|consumo
rato|um tempinho, momento (falso amigo!)
polvo|pó, poeira (falso amigo!)
estantería|estante
oficina|escritório; agência (falso amigo!)
borrar|apagar (falso amigo!)
pizarra|lousa, quadro
apellido|sobrenome (falso amigo!)
pasillo|corredor
acordarse|lembrar-se
presunto|suposto (falso amigo!)
culpable|culpado
tirar|jogar fora; puxar; atirar
basura|lixo
taza|xícara
té|chá
sitio|lugar (falso amigo!)
precioso|lindo
perra|cadela
cachorro|filhote (falso amigo!)
exprimir|espremer
espantoso|horrível
firma|assinatura; empresa
propuesta|proposta
presentación|apresentação
gráfico|gráfico
venta|venda
crecer|crescer
destacar|destacar
siguiente|seguinte, próximo
medida|medida
encantado|encantado; prazer (em conhecer)
objetivo|objetivo; alvo
señalar|apontar, ressaltar
competitivo|competitivo
resumen|resumo
viable|viável
plantear|apresentar, propor (um problema)
dilema|dilema
estratégico|estratégico
enfrentarse|enfrentar
caída|queda
ingreso|receita, renda; ingresso
competencia|concorrência; competência
liquidez|liquidez
diversificar|diversificar
negocio|negócio
corto plazo|curto prazo
convenir|convir
reducir|reduzir
coste|custo
fidelización|fidelização
cuota|cota; cuota de mercado = participação de mercado
fortaleza|ponto forte; fortaleza
catálogo|catálogo
amenaza|ameaça
contacto|contato
candidatura|candidatura
aclaración|esclarecimento
remitir|enviar, remeter
particular|particular
rogar|pedir, rogar
demora|demora
acordar|combinar, acordar
concertar|marcar, combinar (reunião)
dudar|duvidar; hesitar
valor|valor
precio|preço
dispuesto|disposto
negociar|negociar
condición|condição
cifra|cifra, valor, número
suscripción|assinatura (serviço)
sustituir|substituir
segmentar|segmentar
publicitario|publicitário
en picado|em queda livre
adquirir|adquirir
latinoamérica|América Latina
crisis|crise
rentabilidad|rentabilidade
invertir|investir
liderar|liderar
fundamental|fundamental
visión|visão
ambos|ambos
beneficiar|beneficiar
saudade|saudade
despacio|devagar
brasileño|brasileiro
portugués|português
inglés|inglês
entiendo|entendo (entender)
encantada|prazer (dito por mulher)
qué tal|tudo bem?, como vai?
lavapiés|Lavapiés (bairro de Madrid)
italiano|italiano
chica|garota, moça
fácil|fácil
país|país
desayuno|café da manhã
mismo|mesmo
churro|churro
chocolate|chocolate
practicar|praticar
doce|doze
color|cor
azul|azul
rojo|vermelho
gris|cinza
viajar|viajar
máquina|máquina
nocturno|noturno
precio|preço
subir|subir
último|último
normalmente|normalmente
a veces|às vezes
olvidar|esquecer
importante|importante
rápido|rápido
acueducto|aqueduto
romano|romano
impresionante|impressionante
pasear|passear
casco antiguo|centro histórico
alcázar|fortaleza, palácio (Alcázar)
valle|vale
cochinillo|leitão assado
típico|típico
buenísimo|ótimo, muito bom
feliz|feliz
descansar|descansar
especial|especial
gestión|gestão
comunicación|comunicação
funcionar|funcionar
televisión|televisão
digital|digital
debatir|debater
contar|contar; valer (nota)
final|final
miedo|medo
equivocarse|errar
gratis|grátis
vino|vinho
calamar|lula
bravas|batatas bravas (com molho picante)
consagrado|consagrado
voz|voz
aparecer|aparecer, surgir
demostrar|demonstrar
éxito|sucesso (falso amigo!)
producción|produção
invertir|investir
sala|sala
espectador|espectador
dificultad|dificuldade
financiación|financiamento
distribución|distribuição
especializado|especializado
autor|autor
suscriptor|assinante
gracias a|graças a
cuidado|cuidadoso; cuidado
comunidad|comunidade
fiel|fiel
aumentar|aumentar
decisión|decisão
asociarse|associar-se
operadora|operadora
telecomunicaciones|telecomunicações
apostar|apostar
opción|opção
imagen|imagem
financiero|financeiro
estructura|estrutura
fijo|fixo
fijarse|reparar, prestar atenção
párrafo|parágrafo
motivo|motivo
desarrollar|desenvolver
breve|breve
fórmula|fórmula
despedida|despedida
atentamente|atenciosamente
error|erro
mezclar|misturar
mantener|manter
persona|pessoa
década|década
prensa|imprensa
ejemplar|exemplar
romper|romper, quebrar
equilibrio|equilíbrio
lector|leitor
acostumbrarse|acostumar-se
informarse|informar-se
trasladar|transferir, mudar
inversión|investimento
tecnológico|tecnológico
optar|optar
muro de pago|paywall
diario|jornal diário; diário
superar|superar
no obstante|no entanto
experto|especialista
advertir|advertir, alertar
garantizar|garantir
supervivencia|sobrevivência
imprescindible|imprescindível
evento|evento
pódcast|podcast
formación|formação, treinamento
recuperar|recuperar
confianza|confiança
fragmentado|fragmentado
madrileño|madrilenho
industria|indústria
sonoro|sonoro
creativo|criativo
formato|formato
profesional|profissional
en cambio|por outro lado
responsable|responsável
marketing|marketing
episodio|episódio
alcanzar|alcançar
monetizar|monetizar
patrocinio|patrocínio
premium|premium
integrar|integrar
directo|direto
gerente|gerente
elegir|escolher
medir|medir
`;

function parse(block) {
  const out = [];
  for (const line of block.split('\n')) {
    const [es, pt] = line.split('|');
    if (es && pt) out.push([es.trim().toLowerCase(), pt.trim()]);
  }
  return out;
}

const freq = parse(FREQUENT);
const extra = parse(EXTRA);

/** Mapa palavra → tradução. */
export const DICT = new Map();
/** Mapa palavra → posição na lista de frequência (1 = mais comum). */
export const RANK = new Map();

freq.forEach(([es, pt], i) => {
  if (!DICT.has(es)) DICT.set(es, pt);
  if (!RANK.has(es)) RANK.set(es, i + 1);
});
for (const [es, pt] of extra) if (!DICT.has(es)) DICT.set(es, pt);

/** Palavras gramaticais muito comuns: consideradas "conhecidas" no leitor. */
export const FUNCTION_WORDS = new Set(freq.slice(0, 60).map(([es]) => es));
