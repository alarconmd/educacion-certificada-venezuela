window.DATOS = {
  "generado": "build/build_data.py",
  "figuras": [
    {
      "id": "capacitacion-no-formal",
      "nombre": "Capacitación laboral no formal",
      "emisor": "Empresa privada (persona jurídica) que NO se constituye como institución educativa",
      "base": "CRBV arts. 87, 89 y 112. La revisión documental no identificó un permiso educativo específico para capacitación no formal de adultos; el alcance de la LOE y la Resolución 1791 debe confirmarse por escrito",
      "autorizacion": "Condicionado: obtener dictamen independiente y consulta a la Zona Educativa antes de ofrecer. Cumplir además obligaciones mercantiles, municipales, laborales y tributarias",
      "documento": "Constancia de participación o aprovechamiento (NO título, NO certificado de competencia, NO 'certificación oficial')",
      "horas": "Libres: 8 a 120 h",
      "modalidad": "Virtual, mixta o presencial según el oficio y la evidencia de práctica",
      "valor": "Bajo frente a cliente formal hasta acreditar resultados; mejora con aval o verificación pública",
      "riesgo": "Medio y no cerrado: alcance educativo pendiente; alto si se promete una credencial oficial o se dirige a educación escolar",
      "cuando": "Piloto sujeto a compuerta jurídica escrita, validación de demanda, formación interna B2B, mercado privado",
      "semaforo": "amarillo"
    },
    {
      "id": "curso-avalado",
      "nombre": "Curso con aval o co-certificación institucional",
      "emisor": "Empresa + institución avalista (universidad, instituto, INCES, gremio o colegio profesional)",
      "base": "Autonomía universitaria (CRBV art. 109); educación continua de la institución; convenio interinstitucional",
      "autorizacion": "La que ya tenga el avalista. El convenio debe definir control académico, uso de marca y responsabilidad",
      "documento": "Certificado emitido o cofirmado por el avalista, según su propio reglamento",
      "horas": "40 a 200 h",
      "modalidad": "Definida por el reglamento del avalista; puede ser virtual o mixta",
      "valor": "Medio-alto. La credencial hereda la reputación del avalista",
      "riesgo": "Bajo en lo legal; medio en lo contractual (propiedad intelectual, exclusividad, marca)",
      "cuando": "Cuando se necesita credibilidad rápida sin crear institución propia",
      "semaforo": "verde"
    },
    {
      "id": "diplomado",
      "nombre": "Diplomado de educación continua universitaria",
      "emisor": "Institución de Educación Superior (IES) o su fundación, conforme a su reglamento",
      "base": "Ley de Universidades (1970); reglamentos internos de educación continua; normas del CNU",
      "autorizacion": "Ser IES o tener convenio con una. Un particular no puede emitir diplomados por sí solo",
      "documento": "Diploma o certificado de diplomado con registro de la IES",
      "horas": "El reglamento de cada IES define duración y asistencia. Las referencias de 120-200 h y 75 % no son una regla legal general para adultos",
      "modalidad": "Según reglamento de la IES; muchas admiten virtual o mixta. El art. 109 del Reglamento de 1999 era escolar e histórico",
      "valor": "Alto en sector público y en concursos; reconocido como educación continua",
      "riesgo": "Alto si se emite sin IES: uso indebido de denominación y de fe pública",
      "cuando": "Productos premium, convenios con universidades, programas de 5-8 meses",
      "semaforo": "amarillo"
    },
    {
      "id": "competencias-inces",
      "nombre": "Certificación de saberes y competencia laboral (INCES)",
      "emisor": "Instituto Nacional de Capacitación y Educación Socialista (INCES)",
      "base": "Decreto con Rango, Valor y Fuerza de Ley del INCES (G.O. 6.155 Ext. 19/11/2014), arts. 22, 24 y 25",
      "autorizacion": "Registro Nacional de Instancias Organizativas (art. 25), que exige autorización previa de los ministerios con competencia educativa en la modalidad",
      "documento": "Acreditación o certificación de conocimiento INCES; valor para ingreso, ascenso y evaluación en el proceso social de trabajo (art. 24)",
      "horas": "No depende de horas: se evalúan evidencias (autoevaluación, coevaluación y evaluación)",
      "modalidad": "Evaluación presencial de desempeño; la formación previa puede ser virtual",
      "valor": "Muy alto en sector público y empresas del Estado",
      "riesgo": "Alto: no es trámite de ventanilla; exige alianza, cumplimiento documental y tiempo",
      "cuando": "Ruta estratégica de legitimidad para oficios; ideal con empresa ancla pública",
      "semaforo": "amarillo"
    },
    {
      "id": "iso17024",
      "nombre": "Certificación de personas bajo ISO/IEC 17024",
      "emisor": "Organismo certificador acreditado (SENCAMER en Venezuela, o acreditación internacional IAAC/IAF)",
      "base": "ISO/IEC 17024; sistema venezolano de la calidad (SENCAMER); normas COVENIN/FONDONORMA",
      "autorizacion": "Acreditación del esquema: manual, comité de imparcialidad, examen, recertificación",
      "documento": "Certificado de persona con alcance, vigencia y marca de acreditación",
      "horas": "Definidas por el esquema; examen + evidencia + recertificación cada 3-5 años",
      "modalidad": "Examen presencial o proctoreado; la formación previa es libre",
      "valor": "Alto e internacional; muy valorado por multinacionales y contratistas",
      "riesgo": "Muy alto costo y tiempo (12-24 meses); inviable al inicio",
      "cuando": "Fase 3, con flujo de caja y volumen; o mediante alianza con certificador ya acreditado",
      "semaforo": "rojo"
    },
    {
      "id": "tecnico-medio",
      "nombre": "Título de Técnico Medio (educación formal)",
      "emisor": "Plantel privado inscrito, autorizado por el MPPE; título con registro oficial",
      "base": "LOE 2009 (educación media técnica); Resolución 1791/1998 (inscripción de planteles)",
      "autorizacion": "Autorización de plantel, planes de estudio oficiales, docentes titulados, infraestructura y supervisión",
      "documento": "Título de Técnico Medio en la especialidad",
      "horas": "Plan de estudios oficial (media técnica de 6 años)",
      "modalidad": "Presencial con talleres y laboratorios obligatorios",
      "valor": "Máximo para cargos técnicos en el sector público",
      "riesgo": "Muy alto: inversión de años, infraestructura y acreditación docente",
      "cuando": "No recomendado en fase inicial; solo adquisición o alianza de largo plazo",
      "semaforo": "rojo"
    }
  ],
  "fuentes": [
    {
      "id": "crbv",
      "tipo": "primaria",
      "titulo": "Constitución de la República Bolivariana de Venezuela",
      "emisor": "Asamblea Nacional Constituyente",
      "fecha": "1999-12-30",
      "gaceta": "G.O. 36.860; enmienda G.O. 5.908 Ext. (2009)",
      "url": "https://www.tsj.gob.ve/",
      "uso": "Arts. 87, 89, 102-105, 109, 112: derecho al trabajo, educación, autonomía y libertad de empresa",
      "cautela": "Verificar la numeración en el texto consolidado de 2009",
      "nivel": "N2",
      "estadoVerificacion": "Evidencia secundaria/técnica o copia pendiente de contraste oficial y vigencia"
    },
    {
      "id": "loe2009",
      "tipo": "primaria",
      "titulo": "Ley Orgánica de Educación (2009)",
      "emisor": "Asamblea Nacional",
      "fecha": "2009-08-15",
      "gaceta": "G.O. 5.929 Extraordinario",
      "url": "https://www.asambleanacional.gob.ve/storage/documentos/leyes/ley-organi-20220131130620.pdf",
      "uso": "Estructura del sistema educativo, niveles y modalidades, educación media técnica y universitaria",
      "cautela": "PDF oficial escaneado; citar por artículo y página, no por copias de terceros",
      "nivel": "N2",
      "estadoVerificacion": "Evidencia secundaria/técnica o copia pendiente de contraste oficial y vigencia",
      "copiaLocal": "fuentes/loe-2009-ucv.pdf",
      "sha256Copia": "23e8cf8c876a4bba59b45e8479ead9c6cb81e5b0bbdcb8d62f4bcfdc60be3a21"
    },
    {
      "id": "res1791",
      "tipo": "primaria",
      "titulo": "Régimen sobre Autorización y Funcionamiento de Planteles, Cátedras y Servicios Educativos Privados",
      "emisor": "Ministerio de Educación",
      "fecha": "1998-10-16",
      "gaceta": "G.O. 36.566 del 23/10/1998",
      "url": "https://pandectasdigital.blogspot.com/2018/08/regimen-sobre-autorizacion-y.html",
      "uso": "Procedimiento de autorización, documentos, art. 19 (prohibiciones), arts. 21-24 (cátedras y servicios)",
      "cautela": "Dictada bajo la LOE de 1980. Confirmar por escrito su aplicación a cursos de adultos",
      "nivel": "N2",
      "estadoVerificacion": "Evidencia secundaria/técnica o copia pendiente de contraste oficial y vigencia"
    },
    {
      "id": "reglamento1999",
      "tipo": "primaria",
      "titulo": "Reglamento General de la Ley Orgánica de Educación",
      "emisor": "Presidencia de la República",
      "fecha": "1999-09-15",
      "gaceta": "G.O. 36.787, Decreto 313",
      "url": "https://venezuela.justia.com/federales/reglamentos/reglamento-general-de-la-ley-organica-de-educacion/",
      "uso": "Régimen escolar, evaluación, planteles; referencia histórica y residual",
      "cautela": "Reglamenta la LOE de 1980, no la de 2009. No citar como vigente sin análisis",
      "nivel": "N2",
      "estadoVerificacion": "Evidencia secundaria/técnica o copia pendiente de contraste oficial y vigencia",
      "copiaLocal": "fuentes/textos/reglamento-general-loe.txt",
      "sha256Copia": "f5dd5f405cd1f71fd44b9564671dac0aaf986c06a2f6eab0e41eb8e0ecc875c7"
    },
    {
      "id": "inces2014",
      "tipo": "primaria",
      "titulo": "Decreto con Rango, Valor y Fuerza de Ley del Instituto Nacional de Capacitación y Educación Socialista",
      "emisor": "Presidencia de la República",
      "fecha": "2014-11-19",
      "gaceta": "G.O. 6.155 Extraordinario",
      "url": "https://www.asambleanacional.gob.ve/storage/documentos/leyes/decreto-1414-mediante-el-cual-se-dicta-el-decreto-con-rango-valor-y-fuerza-de-ley-del-instituto-nacional-de-capacitacion-y-educacion-socialista-20211103124657.pdf",
      "uso": "Arts. 22, 24 y 25: certificación de saberes, valor laboral y registro de instancias",
      "cautela": "PDF escaneado; el registro de instancias exige autorización ministerial previa",
      "nivel": "N2",
      "estadoVerificacion": "Evidencia secundaria/técnica o copia pendiente de contraste oficial y vigencia",
      "copiaLocal": "fuentes/ley-inces-2014-oficial.pdf",
      "sha256Copia": "f2feacaf4ba987faada9ad804bb9be7c7ce3f20da062bf5566824f23ec9da593"
    },
    {
      "id": "cnu1999",
      "tipo": "primaria",
      "titulo": "Instructivo para tramitar ante el CNU la creación de instituciones de educación superior",
      "emisor": "Consejo Nacional de Universidades",
      "fecha": "1999-12-09",
      "gaceta": "G.O. 36.847",
      "url": "https://cnu.gob.ve/",
      "uso": "Ruta de creación de IES: estudio de factibilidad, estudio académico, plazos",
      "cautela": "Solo aplica si se decide crear una IES; no para capacitación no formal",
      "nivel": "N2",
      "estadoVerificacion": "Evidencia secundaria/técnica o copia pendiente de contraste oficial y vigencia",
      "copiaLocal": "fuentes/cnu-instructivo-creacion-ies.pdf",
      "sha256Copia": "7100442335d0b38ba15183e3f024c62b3ca21c9e5ca8dd22db4f2b37e49642e8"
    },
    {
      "id": "leyuniversidades",
      "tipo": "primaria",
      "titulo": "Ley de Universidades",
      "emisor": "Congreso de la República",
      "fecha": "1970-09-08",
      "gaceta": "G.O. 1.429 Extraordinario",
      "url": "https://www.tsj.gob.ve/",
      "uso": "Autonomía, educación continua y potestad de las IES para emitir credenciales",
      "cautela": "Verificar reglamentos internos de cada IES",
      "nivel": "N2",
      "estadoVerificacion": "Evidencia secundaria/técnica o copia pendiente de contraste oficial y vigencia"
    },
    {
      "id": "lopcymat",
      "tipo": "primaria",
      "titulo": "Ley Orgánica de Prevención, Condiciones y Medio Ambiente de Trabajo",
      "emisor": "Asamblea Nacional",
      "fecha": "2005-07-26",
      "gaceta": "G.O. 38.236; Reglamento G.O. 38.596 (2007)",
      "url": "https://www.inpsasel.gob.ve/",
      "uso": "Formación obligatoria de delegados de prevención y programa de SST",
      "cautela": "Verificar horas exigidas en el programa de SST de cada entidad de trabajo",
      "nivel": "N2",
      "estadoVerificacion": "Evidencia secundaria/técnica o copia pendiente de contraste oficial y vigencia"
    },
    {
      "id": "lottt",
      "tipo": "primaria",
      "titulo": "Ley Orgánica del Trabajo, los Trabajadores y las Trabajadoras",
      "emisor": "Asamblea Nacional",
      "fecha": "2012-05-07",
      "gaceta": "G.O. 6.076 Extraordinario",
      "url": "https://www.mppt.gob.ve/",
      "uso": "Relación laboral, aprendices, capacitación y contratación de facilitadores",
      "cautela": "Revisar reformas posteriores",
      "nivel": "N2",
      "estadoVerificacion": "Evidencia secundaria/técnica o copia pendiente de contraste oficial y vigencia"
    },
    {
      "id": "contrataciones",
      "tipo": "primaria",
      "titulo": "Ley de Contrataciones Públicas",
      "emisor": "Asamblea Nacional",
      "fecha": "2014",
      "gaceta": "G.O. 6.154 Extraordinario",
      "url": "https://www.snc.gob.ve/",
      "uso": "Registro Nacional de Contratistas y solvencia para vender al Estado",
      "cautela": "Verificar el reglamento vigente y los montos de umbral",
      "nivel": "N2",
      "estadoVerificacion": "Evidencia secundaria/técnica o copia pendiente de contraste oficial y vigencia"
    },
    {
      "id": "firmas",
      "tipo": "primaria",
      "titulo": "Ley de Mensajes de Datos y Firmas Electrónicas",
      "emisor": "Asamblea Nacional",
      "fecha": "2001-02-28",
      "gaceta": "G.O. 37.148",
      "url": "https://www.tsj.gob.ve/",
      "uso": "Validez de certificados y documentos electrónicos verificables",
      "cautela": "Usar prestador de servicios de certificación registrado",
      "nivel": "N2",
      "estadoVerificacion": "Evidencia secundaria/técnica o copia pendiente de contraste oficial y vigencia"
    },
    {
      "id": "iso17024",
      "tipo": "tecnica",
      "titulo": "ISO/IEC 17024:2012 — Evaluación de la conformidad. Requisitos generales para los organismos que realizan la certificación de personas",
      "emisor": "ISO / IEC",
      "fecha": "2012",
      "gaceta": "No aplica",
      "url": "https://www.iso.org/standard/52993.html",
      "uso": "Diseño del esquema de certificación, imparcialidad, examen y recertificación",
      "cautela": "Es norma técnica voluntaria; la acreditación la otorga SENCAMER u otro acreditador",
      "nivel": "N2",
      "estadoVerificacion": "Evidencia secundaria/técnica o copia pendiente de contraste oficial y vigencia"
    },
    {
      "id": "sencamer",
      "tipo": "institucional",
      "titulo": "Sistema Venezolano de la Calidad — acreditación",
      "emisor": "SENCAMER",
      "fecha": "vigente",
      "gaceta": "No aplica",
      "url": "https://www.sencamer.gob.ve/",
      "uso": "Ruta de acreditación de organismos de certificación de personas",
      "cautela": "Confirmar alcance, tarifas y tiempos actuales por escrito",
      "nivel": "N4",
      "estadoVerificacion": "Referencia general o hipótesis de alcance; confirmación institucional pendiente"
    },
    {
      "id": "covenin",
      "tipo": "tecnica",
      "titulo": "Normas COVENIN aplicables a oficios (eléctrico, soldadura, seguridad)",
      "emisor": "FONDONORMA / COVENIN",
      "fecha": "varias",
      "gaceta": "No aplica",
      "url": "https://www.fondonorma.org.ve/",
      "uso": "Referencia técnica de los contenidos y de las pruebas prácticas",
      "cautela": "Verificar la vigencia de cada norma antes de citarla en un programa",
      "nivel": "N4",
      "estadoVerificacion": "Referencia general o hipótesis de alcance; confirmación institucional pendiente"
    },
    {
      "id": "cine",
      "tipo": "tecnica",
      "titulo": "Clasificación Internacional Normalizada de la Educación (CINE 2011)",
      "emisor": "UNESCO",
      "fecha": "2011",
      "gaceta": "No aplica",
      "url": "https://uis.unesco.org/es/topic/international-standard-classification-of-education-isced",
      "uso": "Equivalencias internacionales de niveles y tipos de certificación",
      "cautela": "Útil para comparar con Colombia, no para fundar obligaciones en Venezuela",
      "nivel": "N2",
      "estadoVerificacion": "Evidencia secundaria/técnica o copia pendiente de contraste oficial y vigencia"
    },
    {
      "id": "oit",
      "tipo": "estadistica",
      "titulo": "Perspectivas sociales y del empleo / estadísticas de ocupación",
      "emisor": "OIT",
      "fecha": "varias",
      "gaceta": "No aplica",
      "url": "https://www.ilo.org/",
      "uso": "Contexto de informalidad y demanda de cualificaciones",
      "cautela": "Los datos de Venezuela son fragmentarios; usar como marco, no como cifra local",
      "nivel": "N4",
      "estadoVerificacion": "Referencia general o hipótesis de alcance; confirmación institucional pendiente"
    },
    {
      "id": "ine",
      "tipo": "estadistica",
      "titulo": "Encuesta de Hogares por Muestreo y estadísticas de empleo",
      "emisor": "Instituto Nacional de Estadística",
      "fecha": "varias",
      "gaceta": "No aplica",
      "url": "https://www.ine.gob.ve/",
      "uso": "Ocupación, informalidad rama de actividad en Caracas",
      "cautela": "Verificar la última publicación disponible y su cobertura",
      "nivel": "N4",
      "estadoVerificacion": "Referencia general o hipótesis de alcance; confirmación institucional pendiente"
    },
    {
      "id": "consumidor",
      "tipo": "primaria",
      "titulo": "Ley de Protección al Consumidor",
      "emisor": "Asamblea Nacional",
      "fecha": "2010",
      "gaceta": "Verificar G.O.",
      "url": "https://www.sundde.gob.ve/",
      "uso": "Publicidad, información veraz, condiciones contractuales y reembolsos",
      "cautela": "Confirmar número de Gaceta y reformas",
      "nivel": "N2",
      "estadoVerificacion": "Evidencia secundaria/técnica o copia pendiente de contraste oficial y vigencia"
    },
    {
      "id": "comercio",
      "tipo": "primaria",
      "titulo": "Código de Comercio",
      "emisor": "Congreso",
      "fecha": "1955 (con reformas)",
      "gaceta": "G.O. Extraordinario 475",
      "url": "https://www.tsj.gob.ve/",
      "uso": "Constitución de sociedades, registro mercantil y obligaciones contables",
      "cautela": "Verificar reformas y tasas registrales vigentes",
      "nivel": "N2",
      "estadoVerificacion": "Evidencia secundaria/técnica o copia pendiente de contraste oficial y vigencia"
    },
    {
      "id": "propiedad",
      "tipo": "primaria",
      "titulo": "Ley de Propiedad Industrial",
      "emisor": "Congreso",
      "fecha": "1955 (con reformas)",
      "gaceta": "Verificar G.O.",
      "url": "https://www.sapi.gob.ve/",
      "uso": "Registro de marca, lemas y nombres comerciales",
      "cautela": "El registro tarda meses; iniciar antes del lanzamiento",
      "nivel": "N2",
      "estadoVerificacion": "Evidencia secundaria/técnica o copia pendiente de contraste oficial y vigencia"
    }
  ],
  "programas": {
    "metodo": "Índice compuesto 1-5. Demanda = vacantes observadas + rotación + salario relativo + barrera de entrada. Riesgo = exposición regulatoria + seguridad física + probabilidad de daño reputacional. Debe recalibrarse trimestralmente con ofertas laborales reales (ver informe, cap. 7).",
    "programas": [
      {
        "id": "electricidad",
        "nombre": "Instalaciones eléctricas residenciales e industriales",
        "cluster": "Construcción y mantenimiento",
        "horas": 120,
        "horasPractica": 40,
        "modalidad": "mixta",
        "demanda": 5,
        "riesgo": 4,
        "figura": "curso-avalado",
        "requisitos": "18+, bachiller o experiencia; prueba diagnóstica de matemática básica",
        "practica": "Tablero, canalización, medición, puesta a tierra y trabajo en altura supervisado",
        "salida": "Ayudante de electricista, electricista residencial, mantenimiento industrial",
        "normas": "COVENIN 200 (Código Eléctrico Nacional); LOPCYMAT; NFPA 70E como referencia de seguridad",
        "nota": "No habilita por sí solo para trabajos regulados de alta tensión. La práctica y la seguridad son el núcleo del valor."
      },
      {
        "id": "refrigeracion",
        "nombre": "Refrigeración y climatización",
        "cluster": "Construcción y mantenimiento",
        "horas": 160,
        "horasPractica": 64,
        "modalidad": "mixta",
        "demanda": 5,
        "riesgo": 4,
        "figura": "curso-avalado",
        "requisitos": "18+, bachiller; manejo de herramientas",
        "practica": "Diagnóstico, carga de refrigerante, soldadura de cobre, vacío y puesta en marcha",
        "salida": "Técnico de aires acondicionados, refrigeración comercial",
        "normas": "Buenas prácticas de refrigerantes; LOPCYMAT; seguridad eléctrica",
        "nota": "Alta demanda por clima y por parque de equipos envejecido. Requiere taller o aliado con equipos reales."
      },
      {
        "id": "soldadura",
        "nombre": "Soldadura básica y calificada",
        "cluster": "Industria y energía",
        "horas": 120,
        "horasPractica": 60,
        "modalidad": "presencial",
        "demanda": 4,
        "riesgo": 4,
        "figura": "iso17024",
        "requisitos": "18+, aptitud física; evaluación de visión y seguridad",
        "practica": "SMAW/GMAW, posiciones, inspección visual, seguridad y gases",
        "salida": "Soldador de taller, contratista industrial",
        "normas": "ASME IX / AWS D1.1 como referencia; PDVSA y contratistas exigen calificación por probeta",
        "nota": "La credencial que realmente paga es la calificación de procedimiento y probeta, no el curso. Modelo: preparar y presentar al examen."
      },
      {
        "id": "montacargas",
        "nombre": "Operador de montacargas y manejo de almacén",
        "cluster": "Logística",
        "horas": 24,
        "horasPractica": 8,
        "modalidad": "presencial",
        "demanda": 4,
        "riesgo": 3,
        "figura": "capacitacion-no-formal",
        "requisitos": "18+, licencia de conducir según equipo",
        "practica": "Maniobras, carga, estabilidad, inspección preoperacional",
        "salida": "Operador de montacargas, auxiliar de almacén",
        "normas": "LOPCYMAT; manual del fabricante; normas internas de la empresa",
        "nota": "Alta rotación y bajo costo de producción. Ideal para volumen B2B y renovación anual."
      },
      {
        "id": "sst",
        "nombre": "Seguridad y salud en el trabajo (delegados de prevención)",
        "cluster": "Cumplimiento empresarial",
        "horas": 32,
        "horasPractica": 0,
        "modalidad": "virtual",
        "demanda": 5,
        "riesgo": 2,
        "figura": "capacitacion-no-formal",
        "requisitos": "Trabajador designado por la entidad de trabajo",
        "practica": "No aplica; se recomienda estudio de caso de la empresa",
        "salida": "Delegado de prevención, miembro de comité de seguridad",
        "normas": "LOPCYMAT arts. 39, 40, 41 y 43; Reglamento parcial; INPSASEL",
        "nota": "Demanda recurrente y obligatoria por ley para empleadores. El mejor producto de entrada B2B."
      },
      {
        "id": "primeros-auxilios",
        "nombre": "Primeros auxilios y RCP",
        "cluster": "Cumplimiento empresarial",
        "horas": 20,
        "horasPractica": 8,
        "modalidad": "mixta",
        "demanda": 4,
        "riesgo": 3,
        "figura": "curso-avalado",
        "requisitos": "18+; sin requisitos académicos",
        "practica": "RCP, DEA, obstrucción de vía aérea, inmovilización básica",
        "salida": "Brigadista, primer respondiente en empresa",
        "normas": "Guías de reanimación vigentes; LOPCYMAT; aval de salud recomendado",
        "nota": "Exige instructor con credencial vigente y práctica presencial. Vender como brigada, no como profesión de salud."
      },
      {
        "id": "alimentos",
        "nombre": "Manipulación higiénica de alimentos",
        "cluster": "Servicios y turismo",
        "horas": 12,
        "horasPractica": 4,
        "modalidad": "mixta",
        "demanda": 5,
        "riesgo": 2,
        "figura": "curso-avalado",
        "requisitos": "18+; carné de salud cuando la actividad lo exija",
        "practica": "Lavado de manos, cadena de frío, contaminación cruzada, limpieza y desinfección",
        "salida": "Manipulador de alimentos en restaurantes, comedores y caterings",
        "normas": "Reglamento de alimentos; normas sanitarias; competencias municipales de higiene",
        "nota": "Producto de altísimo volumen y bajo ticket. Requiere alianza con autoridad sanitaria o gremio para el certificado que exige el empleador."
      },
      {
        "id": "atencion-cliente",
        "nombre": "Atención al cliente, ventas y cobranza",
        "cluster": "Servicios profesionales",
        "horas": 80,
        "horasPractica": 0,
        "modalidad": "virtual",
        "demanda": 5,
        "riesgo": 1,
        "figura": "capacitacion-no-formal",
        "requisitos": "18+, bachiller; competencias digitales básicas",
        "practica": "Simulaciones y role-play grabado; no requiere presencialidad",
        "salida": "Asesor comercial, cajero, atención al cliente, call center",
        "normas": "Sin regulación específica; Ley de Protección al Consumidor para el contenido de servicio",
        "nota": "100% virtual y escalable. La empleabilidad depende de convenios con empleadores, no del certificado."
      },
      {
        "id": "logistica",
        "nombre": "Logística, inventarios y cadena de suministro",
        "cluster": "Logística",
        "horas": 80,
        "horasPractica": 0,
        "modalidad": "virtual",
        "demanda": 4,
        "riesgo": 1,
        "figura": "capacitacion-no-formal",
        "requisitos": "18+, bachiller; hoja de cálculo básica",
        "practica": "Casos y simulación de almacén; no requiere presencialidad",
        "salida": "Auxiliar de logística, analista de inventarios junior",
        "normas": "Sin regulación específica",
        "nota": "Buen complemento del curso de montacargas: forma el par 'operación + control'."
      },
      {
        "id": "ofimatica-ia",
        "nombre": "Ofimática, habilidades digitales e IA aplicada",
        "cluster": "Servicios profesionales",
        "horas": 60,
        "horasPractica": 0,
        "modalidad": "virtual",
        "demanda": 5,
        "riesgo": 1,
        "figura": "capacitacion-no-formal",
        "requisitos": "18+; sin requisitos académicos",
        "practica": "Proyectos entregables por módulo",
        "salida": "Asistente administrativo, auxiliar de datos, soporte",
        "normas": "Sin regulación específica; cuidado con datos personales de terceros en ejercicios",
        "nota": "Máximo margen y mínima fricción. Sirve como producto de adquisición para luego vender oficios."
      },
      {
        "id": "contabilidad",
        "nombre": "Contabilidad y facturación para PYMES",
        "cluster": "Servicios profesionales",
        "horas": 90,
        "horasPractica": 0,
        "modalidad": "virtual",
        "demanda": 4,
        "riesgo": 2,
        "figura": "capacitacion-no-formal",
        "requisitos": "18+, bachiller; Excel intermedio",
        "practica": "Ciclo contable completo en software",
        "salida": "Auxiliar contable, asistente administrativo",
        "normas": "Código de Comercio; normativa SENIAT; la profesión de contador público está regulada",
        "nota": "Prohibido presentarlo como formación de 'contador público'. Nombrar 'auxiliar contable' y limitar el alcance."
      },
      {
        "id": "cuidados",
        "nombre": "Cuidados domiciliarios de personas mayores",
        "cluster": "Salud y cuidados",
        "horas": 80,
        "horasPractica": 24,
        "modalidad": "mixta",
        "demanda": 3,
        "riesgo": 3,
        "figura": "curso-avalado",
        "requisitos": "18+; certificado de salud; antecedentes",
        "practica": "Movilización, higiene, alimentación asistida, signos vitales",
        "salida": "Cuidador domiciliario, auxiliar de geriátrico",
        "normas": "Actos de enfermería reservados a profesionales; evitar delegación de funciones clínicas",
        "nota": "Demanda creciente por envejecimiento y migración. Requiere supervisión de enfermería y aval institucional."
      }
    ]
  },
  "tramites": [
    {
      "id": "figura",
      "nombre": "Definir la figura certificable y el alcance",
      "autoridad": "Interna (dirección + asesoría jurídica)",
      "base": "Decisión estratégica; ver figuras.json",
      "docs": [
        "Matriz de decisión firmada",
        "Dictamen jurídico externo"
      ],
      "plazo": "1-2 semanas",
      "costoUSD": 800,
      "dependeDe": [],
      "aplicaA": [
        "capacitacion-no-formal",
        "curso-avalado",
        "diplomado",
        "competencias-inces",
        "iso17024"
      ],
      "criticidad": "bloqueante",
      "nota": "Todo lo demás depende de esto. Cambiar de figura después obliga a rehacer contratos, marca y certificados."
    },
    {
      "id": "mercantil",
      "nombre": "Constitución de la sociedad mercantil",
      "autoridad": "Registro Mercantil del estado (Registro Público)",
      "base": "Código de Comercio arts. 165 y siguientes",
      "docs": [
        "Reserva de nombre",
        "Acta constitutiva y estatutos",
        "Solvencia de los socios",
        "Pago de tasas registrales"
      ],
      "plazo": "2-4 semanas",
      "costoUSD": 400,
      "dependeDe": [
        "figura"
      ],
      "aplicaA": [
        "capacitacion-no-formal",
        "curso-avalado",
        "diplomado",
        "competencias-inces",
        "iso17024"
      ],
      "criticidad": "bloqueante",
      "nota": "Definir objeto social amplio: capacitación, consultoría, contenidos y servicios tecnológicos."
    },
    {
      "id": "rif",
      "nombre": "RIF y inscripción tributaria",
      "autoridad": "SENIAT",
      "base": "Código Orgánico Tributario; Providencias SENIAT",
      "docs": [
        "Acta constitutiva",
        "RIF de socios",
        "Dirección fiscal"
      ],
      "plazo": "1-5 días",
      "costoUSD": 0,
      "dependeDe": [
        "mercantil"
      ],
      "aplicaA": [
        "capacitacion-no-formal",
        "curso-avalado",
        "diplomado",
        "competencias-inces",
        "iso17024"
      ],
      "criticidad": "bloqueante",
      "nota": "Habilitar facturación digital y retenciones de IVA/ISLR."
    },
    {
      "id": "municipal",
      "nombre": "Patente de industria y comercio y conformidad de uso",
      "autoridad": "Alcaldía del municipio de la sede",
      "base": "Ordenanzas municipales de patente y uso del suelo",
      "docs": [
        "RIF",
        "Acta constitutiva",
        "Contrato de arrendamiento",
        "Planos",
        "Conformidad de uso"
      ],
      "plazo": "2-6 semanas",
      "costoUSD": 300,
      "dependeDe": [
        "rif"
      ],
      "aplicaA": [
        "capacitacion-no-formal",
        "curso-avalado",
        "diplomado",
        "competencias-inces",
        "iso17024"
      ],
      "criticidad": "bloqueante",
      "nota": "Si se opera 100% virtual sin sede con público, verificar si el municipio exige oficina. No asumirlo."
    },
    {
      "id": "bomberos",
      "nombre": "Constancia de bomberos y condiciones de seguridad",
      "autoridad": "Cuerpo de Bomberos del municipio",
      "base": "Ordenanzas y normas de prevención de incendios",
      "docs": [
        "Planos",
        "Extintores",
        "Señalización",
        "Plan de evacuación"
      ],
      "plazo": "1-3 semanas",
      "costoUSD": 250,
      "dependeDe": [
        "municipal"
      ],
      "aplicaA": [
        "capacitacion-no-formal",
        "curso-avalado",
        "diplomado",
        "competencias-inces",
        "iso17024"
      ],
      "criticidad": "condicional",
      "nota": "Solo si hay sede física con aforo o talleres. Si todo es virtual, documentar la ausencia de sede operativa."
    },
    {
      "id": "inpsasel",
      "nombre": "Registro de empresa y programa de seguridad y salud",
      "autoridad": "INPSASEL",
      "base": "LOPCYMAT y su Reglamento Parcial",
      "docs": [
        "Registro de empresa",
        "Política de SST",
        "Programa de SST",
        "Delegados de prevención"
      ],
      "plazo": "2-6 semanas",
      "costoUSD": 500,
      "dependeDe": [
        "rif"
      ],
      "aplicaA": [
        "capacitacion-no-formal",
        "curso-avalado",
        "diplomado",
        "competencias-inces",
        "iso17024"
      ],
      "criticidad": "recomendado",
      "nota": "Obligatorio como empleador, pero además es la puerta comercial al mercado de cursos de SST."
    },
    {
      "id": "inces-aportes",
      "nombre": "Inscripción como entidad de trabajo y aporte del INCES",
      "autoridad": "INCES",
      "base": "Decreto Ley del INCES (2014); aporte sobre utilidades",
      "docs": [
        "RIF",
        "Acta constitutiva",
        "Nómina",
        "Declaración de utilidades"
      ],
      "plazo": "2-4 semanas",
      "costoUSD": 0,
      "dependeDe": [
        "rif"
      ],
      "aplicaA": [
        "capacitacion-no-formal",
        "curso-avalado",
        "diplomado",
        "competencias-inces",
        "iso17024"
      ],
      "criticidad": "bloqueante",
      "nota": "El aporte patronal es distinto del registro como instancia de formación. No confundirlos."
    },
    {
      "id": "rnp",
      "nombre": "Registro Nacional de Contratistas y solvencia laboral",
      "autoridad": "Servicio Nacional de Contrataciones / MPPT",
      "base": "Ley de Contrataciones Públicas y su Reglamento",
      "docs": [
        "RIF",
        "Acta constitutiva",
        "Solvencia laboral",
        "Estados financieros",
        "Experiencia"
      ],
      "plazo": "4-8 semanas",
      "costoUSD": 600,
      "dependeDe": [
        "rif",
        "inpsasel"
      ],
      "aplicaA": [
        "curso-avalado",
        "diplomado",
        "competencias-inces"
      ],
      "criticidad": "condicional",
      "nota": "Imprescindible para vender capacitación a empresas públicas y organismos del Estado."
    },
    {
      "id": "sapi",
      "nombre": "Registro de marca y protección de contenidos",
      "autoridad": "SAPI (Servicio Autónomo de la Propiedad Intelectual)",
      "base": "Ley de Propiedad Industrial; Ley de Derecho de Autor",
      "docs": [
        "Solicitud de marca",
        "Logo",
        "Pago de tasa",
        "Contratos de cesión de autores"
      ],
      "plazo": "1-3 meses",
      "costoUSD": 350,
      "dependeDe": [
        "mercantil"
      ],
      "aplicaA": [
        "capacitacion-no-formal",
        "curso-avalado",
        "diplomado",
        "competencias-inces",
        "iso17024"
      ],
      "criticidad": "recomendado",
      "nota": "Registrar el nombre del método y del certificado, no solo el logo. Ceder derechos de los docentes por contrato."
    },
    {
      "id": "contratos",
      "nombre": "Contratos, términos y publicidad responsable",
      "autoridad": "Interna (asesoría legal)",
      "base": "Código Civil; Ley de Protección al Consumidor; Resolución 1791/1998 art. 19 (prohibición de prometer empleo)",
      "docs": [
        "Términos y condiciones",
        "Política de privacidad",
        "Contrato B2B",
        "Contrato de instructor",
        "Guion de admisiones"
      ],
      "plazo": "2-3 semanas",
      "costoUSD": 900,
      "dependeDe": [
        "figura"
      ],
      "aplicaA": [
        "capacitacion-no-formal",
        "curso-avalado",
        "diplomado",
        "competencias-inces",
        "iso17024"
      ],
      "criticidad": "bloqueante",
      "nota": "Prohibido prometer colocación laboral inmediata. La promesa de empleo es la falta más sancionada en el régimen de planteles privados."
    },
    {
      "id": "certificado",
      "nombre": "Diseño del certificado y verificador público",
      "autoridad": "Interna + estándar técnico",
      "base": "Ley de Mensajes de Datos y Firmas Electrónicas; ISO/IEC 17024 como referencia de esquema",
      "docs": [
        "Plantilla",
        "Código único",
        "QR de verificación",
        "Registro de emisión",
        "Política de revocación"
      ],
      "plazo": "4-6 semanas",
      "costoUSD": 1200,
      "dependeDe": [
        "figura",
        "contratos"
      ],
      "aplicaA": [
        "capacitacion-no-formal",
        "curso-avalado",
        "diplomado",
        "competencias-inces",
        "iso17024"
      ],
      "criticidad": "recomendado",
      "nota": "El verificador público es la diferencia práctica entre un PDF decorativo y una credencial confiable."
    },
    {
      "id": "zona-educativa",
      "nombre": "Consulta formal a la Zona Educativa",
      "autoridad": "Zona Educativa de la entidad federal",
      "base": "Resolución 1791/1998 (alcance sobre cátedras y servicios educativos)",
      "docs": [
        "Carta de consulta",
        "Descripción del programa",
        "Público objetivo",
        "Modalidad",
        "Modelo de certificado"
      ],
      "plazo": "2-8 semanas",
      "costoUSD": 0,
      "dependeDe": [
        "figura"
      ],
      "aplicaA": [
        "capacitacion-no-formal",
        "curso-avalado"
      ],
      "criticidad": "recomendado",
      "nota": "Pedir pronunciamiento escrito. Sin respuesta, dejar constancia de la consulta y operar con el alcance más conservador."
    },
    {
      "id": "mppe-catedra",
      "nombre": "Autorización de cátedra o servicio educativo",
      "autoridad": "Zona Educativa / MPPE",
      "base": "Resolución 1791/1998 arts. 21, 22 y 24",
      "docs": [
        "Planilla de solicitud",
        "Documentos societarios",
        "Programa y plan de evaluación",
        "Horarios y duración",
        "Costos",
        "Credenciales docentes",
        "Inmueble"
      ],
      "plazo": "2 meses (plazo legal de decisión)",
      "costoUSD": 700,
      "dependeDe": [
        "zona-educativa",
        "municipal"
      ],
      "aplicaA": [
        "curso-avalado"
      ],
      "criticidad": "condicional",
      "nota": "Solo si el curso cae en el ámbito de la educación básica o media. La autoridad debe motivar la decisión."
    },
    {
      "id": "inces-instancia",
      "nombre": "Registro Nacional de Instancias Organizativas",
      "autoridad": "INCES",
      "base": "Decreto Ley del INCES art. 25",
      "docs": [
        "Autorización ministerial previa",
        "Programas",
        "Facilitadores",
        "Infraestructura o plataforma"
      ],
      "plazo": "3-9 meses",
      "costoUSD": 1500,
      "dependeDe": [
        "mppe-catedra",
        "inces-aportes"
      ],
      "aplicaA": [
        "competencias-inces"
      ],
      "criticidad": "condicional",
      "nota": "La ley exige que la instancia esté autorizada por el ministerio con competencia en la modalidad. Es un cuello de botella real."
    },
    {
      "id": "aval",
      "nombre": "Convenio de aval con universidad o instituto",
      "autoridad": "IES (consejo académico o dirección de extensión)",
      "base": "Autonomía universitaria; reglamento de educación continua de la IES",
      "docs": [
        "Propuesta académica",
        "Malla curricular",
        "Perfiles docentes",
        "Modelo de certificado",
        "Convenio"
      ],
      "plazo": "2-6 meses",
      "costoUSD": 2000,
      "dependeDe": [
        "figura"
      ],
      "aplicaA": [
        "curso-avalado",
        "diplomado"
      ],
      "criticidad": "condicional",
      "nota": "Negociar reparto 60/40 o 70/30, propiedad de la marca y no exclusividad de los contenidos."
    },
    {
      "id": "iso",
      "nombre": "Acreditación como organismo certificador de personas",
      "autoridad": "SENCAMER (o acreditador internacional)",
      "base": "ISO/IEC 17024; evaluación de la conformidad",
      "docs": [
        "Manual de calidad",
        "Esquema de certificación",
        "Comité de imparcialidad",
        "Banco de examinadores",
        "Auditoría"
      ],
      "plazo": "12-24 meses",
      "costoUSD": 25000,
      "dependeDe": [
        "certificado",
        "aval"
      ],
      "aplicaA": [
        "iso17024"
      ],
      "criticidad": "condicional",
      "nota": "No iniciar sin 300+ certificados anuales y un esquema técnico validado por el sector."
    }
  ],
  "viajes": {
    "empresa": [
      {
        "n": 0,
        "id": "validacion",
        "nombre": "Validación de demanda y foco",
        "duracion": "3-4 semanas",
        "objetivo": "Elegir 2 oficios y 1 empresa ancla antes de invertir en marca",
        "entregables": [
          "20 entrevistas (10 empleadores, 10 candidatos)",
          "Análisis de 100 ofertas laborales",
          "Decisión de portafolio inicial"
        ],
        "decision": "¿Virtual puro o híbrido?",
        "riesgo": "Construir un producto que nadie compra",
        "kpi": "10 empleadores con carta de interés"
      },
      {
        "n": 1,
        "id": "diseno-legal",
        "nombre": "Diseño legal del modelo",
        "duracion": "3-4 semanas",
        "objetivo": "Fijar la figura certificable y el lenguaje permitido",
        "entregables": [
          "Dictamen jurídico",
          "Matriz de figuras",
          "Modelo de certificado y disclaimer"
        ],
        "decision": "Capacitación no formal o buscar aval",
        "riesgo": "Usar 'certificación' y quedar expuesto",
        "kpi": "Dictamen firmado y revisión de mercadeo"
      },
      {
        "n": 2,
        "id": "constitucion",
        "nombre": "Constitución y cumplimiento base",
        "duracion": "4-8 semanas",
        "objetivo": "Existir legalmente y poder facturar",
        "entregables": [
          "Registro mercantil",
          "RIF",
          "Patente municipal",
          "Cuenta bancaria"
        ],
        "decision": "Sede física vs. dirección virtual",
        "riesgo": "Retraso registral y bloqueo de pagos",
        "kpi": "Empresa facturando"
      },
      {
        "n": 3,
        "id": "cumplimiento-laboral",
        "nombre": "Cumplimiento laboral y SST",
        "duracion": "3-6 semanas",
        "objetivo": "Ser empleador y proveedor elegible",
        "entregables": [
          "Registro INPSASEL",
          "Programa de SST",
          "Afiliaciones",
          "Contratos modelo"
        ],
        "decision": "Nómina propia vs. facilitadores por servicios",
        "riesgo": "Pasivos laborales por figura mal elegida",
        "kpi": "Cero contingencias en auditoría"
      },
      {
        "n": 4,
        "id": "curriculum",
        "nombre": "Diseño curricular por competencias",
        "duracion": "4-6 semanas por programa",
        "objetivo": "Convertir el oficio en resultados de aprendizaje evaluables",
        "entregables": [
          "Malla y carga horaria",
          "Rúbricas",
          "Evidencias de desempeño",
          "Guía del facilitador"
        ],
        "decision": "Horas reloj vs. créditos",
        "riesgo": "Curso que no demuestra competencia",
        "kpi": "Validación por 3 expertos del oficio"
      },
      {
        "n": 5,
        "id": "tecnologia",
        "nombre": "Plataforma y trazabilidad",
        "duracion": "4-8 semanas",
        "objetivo": "Operar cohortes sin perder evidencia",
        "entregables": [
          "LMS",
          "Registro de asistencia",
          "Repositorio de evidencias",
          "Verificador de certificados"
        ],
        "decision": "Comprar vs. construir",
        "riesgo": "Dependencia de un solo proveedor",
        "kpi": "99% de evidencias recuperables"
      },
      {
        "n": 6,
        "id": "aval",
        "nombre": "Alianza de aval",
        "duracion": "2-6 meses",
        "objetivo": "Heredar credibilidad y acceso institucional",
        "entregables": [
          "Convenio",
          "Reglamento aplicable",
          "Modelo de certificado cofirmado"
        ],
        "decision": "Universidad, gremio o INCES",
        "riesgo": "Negociación desbalanceada",
        "kpi": "Convenio firmado con reparto claro"
      },
      {
        "n": 7,
        "id": "piloto",
        "nombre": "Piloto B2B",
        "duracion": "8-12 semanas",
        "objetivo": "Probar el ciclo completo con una empresa real",
        "entregables": [
          "Cohorte piloto",
          "Informe de resultados",
          "Testimonios",
          "Ajustes"
        ],
        "decision": "Precio y duración definitivos",
        "riesgo": "Sobreventa y baja finalización",
        "kpi": ">85% de finalización y 1 carta de recomendación"
      },
      {
        "n": 8,
        "id": "escala",
        "nombre": "Escala y acreditación",
        "duracion": "6-18 meses",
        "objetivo": "Repetir sin depender del fundador",
        "entregables": [
          "Portafolio de 6 programas",
          "Red de facilitadores",
          "ISO 17024 o alianza"
        ],
        "decision": "Acreditación propia vs. alianza",
        "riesgo": "Crecer sin control de calidad",
        "kpi": "300+ certificados/año y margen >35%"
      }
    ],
    "cliente": [
      {
        "n": 1,
        "etapa": "Descubrimiento",
        "canal": "Redes, referidos, ferias de empleo",
        "queHace": "Compara opciones y busca precio",
        "queNecesita": "Ver que el certificado sirve para conseguir trabajo",
        "friccion": "Desconfianza por cursos que no cumplen",
        "nuestroRol": "Mostrar verificador, convenios y egresados"
      },
      {
        "n": 2,
        "etapa": "Diagnóstico",
        "canal": "WhatsApp / formulario",
        "queHace": "Cuenta su experiencia y su objetivo",
        "queNecesita": "Saber si califica y cuánto tarda",
        "friccion": "No sabe leer su propio nivel",
        "nuestroRol": "Prueba diagnóstica de 15 minutos"
      },
      {
        "n": 3,
        "etapa": "Inscripción",
        "canal": "Pasarela de pago",
        "queHace": "Paga y entrega documentos",
        "queNecesita": "Claridad de condiciones y reembolsos",
        "friccion": "Desconfianza en pagos en línea",
        "nuestroRol": "Contrato simple y pago fraccionado"
      },
      {
        "n": 4,
        "etapa": "Nivelación",
        "canal": "LMS",
        "queHace": "Nivela matemática, lectura y uso de plataforma",
        "queNecesita": "No sentirse perdido",
        "friccion": "Abandono en la primera semana",
        "nuestroRol": "Tutoría y recordatorios"
      },
      {
        "n": 5,
        "etapa": "Formación",
        "canal": "LMS + taller",
        "queHace": "Estudia y practica",
        "queNecesita": "Flexibilidad horaria y práctica real",
        "friccion": "Trabajo informal y conectividad",
        "nuestroRol": "Móvil primero y sesiones grabadas"
      },
      {
        "n": 6,
        "etapa": "Práctica",
        "canal": "Taller o empresa aliada",
        "queHace": "Aplica en condiciones reales",
        "queNecesita": "Supervisión y evaluación",
        "friccion": "Falta de cupos de práctica",
        "nuestroRol": "Convenios de práctica y seguro"
      },
      {
        "n": 7,
        "etapa": "Evaluación",
        "canal": "Presencial o proctoreada",
        "queHace": "Demuestra desempeño y conocimiento",
        "queNecesita": "Reglas claras y segunda oportunidad",
        "friccion": "Miedo a reprobar",
        "nuestroRol": "Rúbrica pública y retroalimentación"
      },
      {
        "n": 8,
        "etapa": "Certificación",
        "canal": "Portal del egresado",
        "queHace": "Recibe certificado y código",
        "queNecesita": "Que el empleador lo pueda verificar",
        "friccion": "Certificado que nadie reconoce",
        "nuestroRol": "Verificador público y carta al empleador"
      },
      {
        "n": 9,
        "etapa": "Empleabilidad",
        "canal": "Bolsa de empleo",
        "queHace": "Aplica a vacantes",
        "queNecesita": "Contacto con empresas",
        "friccion": "Sin red de empleadores",
        "nuestroRol": "Alianzas y presentación de perfiles"
      },
      {
        "n": 10,
        "etapa": "Recertificación",
        "canal": "Correo y WhatsApp",
        "queHace": "Actualiza su credencial",
        "queNecesita": "Que su certificado no caduque",
        "friccion": "Olvido",
        "nuestroRol": "Recordatorio a 24 meses y curso puente"
      }
    ],
    "escenarios": [
      {
        "id": "pesimista",
        "nombre": "Pesimista",
        "cohortesAnio": 12,
        "alumnosPorCohorte": 15,
        "precioPromedioUSD": 200,
        "costoVariableUSD": 55,
        "costoFijoAnualUSD": 66000,
        "nota": "Solo B2C, sin aval, una sola ciudad"
      },
      {
        "id": "base",
        "nombre": "Base",
        "cohortesAnio": 24,
        "alumnosPorCohorte": 22,
        "precioPromedioUSD": 220,
        "costoVariableUSD": 55,
        "costoFijoAnualUSD": 72000,
        "nota": "Supuesto agregado: B2C + 3 contratos B2B y aval firmado; no es demanda observada"
      },
      {
        "id": "optimista",
        "nombre": "Optimista",
        "cohortesAnio": 36,
        "alumnosPorCohorte": 25,
        "precioPromedioUSD": 240,
        "costoVariableUSD": 55,
        "costoFijoAnualUSD": 95000,
        "nota": "Supuesto: B2B recurrente + INCES + segunda ciudad"
      }
    ],
    "modeloB2B": {
      "estado": "Referencia N4 por validar con cotizaciones y contratos; no es un margen observado",
      "contratosBase": 3,
      "alumnosPorContrato": 25,
      "horasPorContrato": 80,
      "facilitadoresPorContrato": 1,
      "horasPracticaPresencial": 24,
      "precioPorAlumnoUSD": 140,
      "precioContratoUSD": 3500,
      "costoVariableAlumnoUSD": 55,
      "comisionCobroIncluida": true,
      "contribucionContratoUSD": 2125,
      "condicionCobro": "50 % de anticipo y saldo contra entrega; el costo variable incluye facilitación, materiales, práctica, comisión y cobro",
      "nota": "Los tres contratos representan 75 de los 528 alumnos base. No se suman otra vez al resultado agregado."
    },
    "flujoCaja": [
      {
        "trimestre": "T1",
        "inscripciones": 40,
        "ingresos": 8800,
        "egresos": 20200
      },
      {
        "trimestre": "T2",
        "inscripciones": 110,
        "ingresos": 24200,
        "egresos": 24050
      },
      {
        "trimestre": "T3",
        "inscripciones": 160,
        "ingresos": 35200,
        "egresos": 26800
      },
      {
        "trimestre": "T4",
        "inscripciones": 218,
        "ingresos": 47960,
        "egresos": 29990
      }
    ]
  }
};
