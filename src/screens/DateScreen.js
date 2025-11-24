// screens/DateScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import 'moment/locale/es';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "../styles/DateScreenStyles";
import { lightTheme, darkTheme } from "../styles/themes";

// Configuración mejorada de moment para español
moment.locale('es', {
  months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
  monthsShort: 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
  weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
  weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
  weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_')
});
moment.locale('es');

// Configuración API
const API_BASE_URL = 'https://f735b4d5b059.ngrok-free.app/api';

export default function DateScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { empresa, isDarkMode } = route.params;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTecnico, setSelectedTecnico] = useState(null);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showServiciosModal, setShowServiciosModal] = useState(false);
  const [notas, setNotas] = useState('');
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  const [tecnicos, setTecnicos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [clienteActual, setClienteActual] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);

  const themeStyles = isDarkMode ? darkTheme : lightTheme;

  // Obtener usuario autenticado
  const obtenerUsuarioAutenticado = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) return JSON.parse(userData);
      return null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  };

  // OBTENER CLIENTE POR ID USUARIO
  const obtenerClientePorUsuario = async (idUsuario) => {
    try {
      ('🔍 Buscando cliente para IdUsuario:', idUsuario);
      
      const response = await axios.get(`${API_BASE_URL}/clientes`);
      ('📋 Todos los clientes:', response.data);
      
      // Buscar cliente que coincida con el IdUsuario
      const clienteEncontrado = response.data.find(
        cliente => Number(cliente.IdUsuario) === Number(idUsuario)
      );
      
      (' Cliente encontrado:', clienteEncontrado);
      
      if (clienteEncontrado) {
        return {
          IdCliente: Number(clienteEncontrado.IdCliente),
          IdUsuario: Number(clienteEncontrado.IdUsuario),
          Estado: clienteEncontrado.Estado
        };
      }
      
      (' No se encontró cliente para IdUsuario:', idUsuario);
      return null;
      
    } catch (error) {
      console.error(' Error obteniendo cliente:', error);
      return null;
    }
  };

  // FUNCIÓN AUXILIAR PARA CONVERTIR FORMATO 12H A 24H
  const convertir12a24 = (hora, periodo) => {
    let horaNum = parseInt(hora);
    if (periodo === 'pm' && horaNum < 12) {
      horaNum += 12;
    } else if (periodo === 'am' && horaNum === 12) {
      horaNum = 0;
    }
    return `${horaNum.toString().padStart(2, '0')}:00`;
  };

  // FUNCIÓN MEJORADA PARA GENERAR HORARIOS DESDE TEXTO PLANO
  const generarHorariosDesdeTexto = (horarioTexto) => {
    ('📝 Generando horarios desde texto:', horarioTexto);
    
    // Múltiples patrones para extraer horarios
    const patrones = [
      // Patrón: "10:00 - 19:00" o "10:00 a 19:00"
      /(\d{1,2}:\d{2})\s*[-a]\s*(\d{1,2}:\d{2})/,
      // Patrón: "10:00-19:00" (sin espacios)
      /(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/,
      // Patrón: "10 am - 7 pm"
      /(\d{1,2})\s*(am|pm)?\s*[-a]\s*(\d{1,2})\s*(am|pm)/i,
      // Patrón: "10:00 a 9:00" (caso específico del log)
      /(\d{1,2}:\d{2})\s*a\s*(\d{1,2}:\d{2})/,
    ];
    
    for (const patron of patrones) {
      const horarioMatch = horarioTexto.match(patron);
      if (horarioMatch) {
        let inicio, fin;
        
        if (patron === patrones[0] || patron === patrones[1] || patron === patrones[3]) {
          // Formato 24 horas
          inicio = horarioMatch[1];
          fin = horarioMatch[2];
          
          // Validar formato de hora
          if (!moment(inicio, 'HH:mm', true).isValid() || !moment(fin, 'HH:mm', true).isValid()) {
            (' Formato de hora inválido, continuando con siguiente patrón');
            continue;
          }
        } else if (patron === patrones[2]) {
          // Formato 12 horas
          const horaInicio = parseInt(horarioMatch[1]);
          const periodoInicio = horarioMatch[2]?.toLowerCase() || 'am';
          const horaFin = parseInt(horarioMatch[3]);
          const periodoFin = horarioMatch[4]?.toLowerCase();
          
          inicio = convertir12a24(horaInicio, periodoInicio);
          fin = convertir12a24(horaFin, periodoFin);
        }
        
        ('⏰ Horarios extraídos:', { inicio, fin });
        
        return generarHorariosRango(inicio, fin);
      }
    }
    
    // Si no se puede extraer, usar horarios por defecto
    (' No se pudieron extraer horarios del texto, usando por defecto');
    return generarHorariosPorDefecto();
  };

  // FUNCIÓN CORREGIDA PARA GENERAR HORARIOS DESDE EL HORARIO DE ATENCIÓN ESTRUCTURADO
  const generarHorariosDesdeHorarioAtencion = (horarioAtencion) => {
    ('🔄 Generando horarios desde horario estructurado:', horarioAtencion);
    
    // Si es un array (formato JSON estructurado)
    if (Array.isArray(horarioAtencion)) {
      // Obtener día actual en español directamente
      let diaActual;
      try {
        diaActual = moment().locale('es').format('dddd').toLowerCase();
        ('📅 Día actual (español):', diaActual);
      } catch (error) {
        console.error(' Error obteniendo día actual:', error);
        // Si falla, intentar con inglés como fallback
        try {
          diaActual = moment().locale('en').format('dddd').toLowerCase();
          ('📅 Día actual (inglés fallback):', diaActual);
        } catch (error2) {
          console.error(' Error completo obteniendo día:', error2);
          diaActual = 'lunes'; // Valor por defecto
        }
      }
      
      // Mapa de días en minúsculas para comparación
      const diasMap = {
        'monday': 'lunes',
        'tuesday': 'martes', 
        'wednesday': 'miércoles',
        'thursday': 'jueves',
        'friday': 'viernes',
        'saturday': 'sábado',
        'sunday': 'domingo',
        'lunes': 'lunes',
        'martes': 'martes',
        'miércoles': 'miércoles',
        'miercoles': 'miércoles',
        'jueves': 'jueves',
        'viernes': 'viernes',
        'sábado': 'sábado',
        'sabado': 'sábado',
        'domingo': 'domingo'
      };
      
      const diaActualNormalizado = diasMap[diaActual] || 'lunes';
      ('📅 Día actual normalizado:', diaActualNormalizado);
      
      // Función auxiliar para normalizar texto (quitar acentos)
      const normalizarTexto = (texto) => {
        return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      };
      
      // Buscar el horario para el día actual
      const horarioHoy = horarioAtencion.find(h => {
        if (!h.dia) return false;
        const diaHorarioNormalizado = normalizarTexto(h.dia);
        const diaActualNormalizadoSinAcentos = normalizarTexto(diaActualNormalizado);
        return diaHorarioNormalizado === diaActualNormalizadoSinAcentos;
      });
      
      ('🔍 Horario encontrado para hoy:', horarioHoy);
      
      if (horarioHoy && horarioHoy.activo !== false) {
        const inicio = horarioHoy.inicio || '09:00';
        const fin = horarioHoy.fin || '18:00';
        
        ('⏰ Generando horarios desde:', inicio, 'hasta:', fin);
        return generarHorariosRango(inicio, fin);
      } else {
        // Si el negocio está cerrado hoy, buscar el próximo día abierto
        ('🔍 Buscando próximo día abierto...');
        for (let i = 1; i <= 7; i++) {
          let proximoDia;
          try {
            proximoDia = moment().add(i, 'days').locale('es').format('dddd').toLowerCase();
          } catch (error) {
            console.error(' Error obteniendo próximo día:', error);
            continue;
          }
          
          const proximoDiaNormalizado = diasMap[proximoDia];
          if (!proximoDiaNormalizado) continue;
          
          const horarioProximoDia = horarioAtencion.find(h => {
            if (!h.dia) return false;
            const diaHorarioNormalizado = normalizarTexto(h.dia);
            const diaProximoNormalizadoSinAcentos = normalizarTexto(proximoDiaNormalizado);
            return diaHorarioNormalizado === diaProximoNormalizadoSinAcentos && h.activo !== false;
          });
          
          if (horarioProximoDia) {
            const inicio = horarioProximoDia.inicio || '09:00';
            const fin = horarioProximoDia.fin || '18:00';
            
            (' Próximo día abierto:', proximoDiaNormalizado, 'de', inicio, 'a', fin);
            return generarHorariosRango(inicio, fin);
          }
        }
      }
    }
    
    // Si no se pudo generar desde el formato estructurado, usar por defecto
    (' No se pudo generar desde formato estructurado, usando por defecto');
    return generarHorariosPorDefecto();
  };

  // FUNCIÓN AUXILIAR PARA GENERAR HORARIOS EN UN RANGO
  const generarHorariosRango = (inicio, fin) => {
    const horarios = [];
    
    // Validar formatos de hora
    const inicioMoment = moment(inicio, 'HH:mm');
    const finMoment = moment(fin, 'HH:mm');
    
    if (!inicioMoment.isValid() || !finMoment.isValid()) {
      (' Formatos de hora inválidos, usando horarios por defecto');
      return generarHorariosPorDefecto();
    }
    
    // Si la hora fin es menor que la inicio, asumir que es del día siguiente
    if (finMoment.isBefore(inicioMoment)) {
      finMoment.add(1, 'day');
    }
    
    let horarioActual = inicioMoment.clone();
    
    while (horarioActual.isBefore(finMoment)) {
      horarios.push(horarioActual.format('HH:mm'));
      horarioActual.add(15, 'minutes');
    }
    
    (`🕐 Generados ${horarios.length} horarios de ${inicio} a ${fin}`);
    return horarios;
  };

  // FUNCIÓN PARA GENERAR HORARIOS POR DEFECTO
  const generarHorariosPorDefecto = () => {
    ('⚡ Usando horarios por defecto');
    return [
      '08:00','08:15','08:30','08:45','09:00','09:15','09:30','09:45',
      '10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45',
      '12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45',
      '14:00','14:15','14:30','14:45','15:00','15:15','15:30','15:45',
      '16:00','16:15','16:30','16:45','17:00','17:15','17:30','17:45'
    ];
  };

  // OBTENER HORARIOS DISPONIBLES DESDE LA API POR ID DEL NEGOCIO
  const obtenerHorariosDisponibles = async (idNegocio) => {
    try {
      setLoadingHorarios(true);
      
      ('🕐 Obteniendo horarios disponibles para negocio ID:', idNegocio);
      
      // Hacer la petición a la API para obtener los datos del negocio específico
      const response = await axios.get(`${API_BASE_URL}/Negocios/${idNegocio}`);
      const negocioData = response.data;
      
      ('📊 Datos del negocio recibidos:', negocioData);
      
      if (negocioData && negocioData.HorarioAtencion) {
        ('📅 Horario de atención encontrado:', negocioData.HorarioAtencion);
        
        // Parsear el JSON string si es necesario
        let horarioAtencion;
        if (typeof negocioData.HorarioAtencion === 'string') {
          try {
            horarioAtencion = JSON.parse(negocioData.HorarioAtencion);
            (' Horario parseado como JSON:', horarioAtencion);
          } catch (parseError) {
            ('📝 Horario es texto plano:', negocioData.HorarioAtencion);
            // Si es texto plano, generar horarios basados en el texto
            const horariosGenerados = generarHorariosDesdeTexto(negocioData.HorarioAtencion);
            setHorariosDisponibles(horariosGenerados);
            return;
          }
        } else {
          horarioAtencion = negocioData.HorarioAtencion;
        }
        
        // Generar horarios disponibles basados en el horario de atención
        const horariosGenerados = generarHorariosDesdeHorarioAtencion(horarioAtencion);
        setHorariosDisponibles(horariosGenerados);
        
        (' Horarios disponibles generados:', horariosGenerados);
      } else {
        (' No se encontró horario de atención, usando horarios por defecto');
        // Usar horarios por defecto si no hay horario específico
        setHorariosDisponibles(generarHorariosPorDefecto());
      }
      
    } catch (error) {
      console.error(' Error obteniendo horarios disponibles:', error);
      ('🔴 Error details:', error.response?.data || error.message);
      ('🔄 Usando horarios por defecto debido al error');
      // En caso de error, usar horarios por defecto
      setHorariosDisponibles(generarHorariosPorDefecto());
    } finally {
      setLoadingHorarios(false);
    }
  };

  // Cargar datos iniciales - USAR useCallback PARA EVITAR EJECUCIONES MÚLTIPLES
  useEffect(() => {
    let isMounted = true;
    
    const cargarDatosIniciales = async () => {
      if (!isMounted) return;
      
      try {
        setLoadingData(true);
        ('🚀 Iniciando carga de datos para negocio:', empresa.Nombre, 'ID:', empresa.IdNegocio);

        const usuario = await obtenerUsuarioAutenticado();
        ('👤 Usuario autenticado:', usuario);
        
        if (!usuario) {
          Alert.alert(
            'Sesión requerida',
            'Debes iniciar sesión para agendar una cita',
            [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
          );
          return;
        }

        setUsuarioActual(usuario);

        // OBTENER CLIENTE
        const cliente = await obtenerClientePorUsuario(usuario.IdUsuario);
        
        if (!cliente) {
          Alert.alert(
            'Cliente no encontrado',
            'Tu usuario no tiene un cliente asociado. Contacta al administrador.'
          );
          return;
        }

        (' Cliente asignado:', cliente);
        setClienteActual(cliente);

        // CARGAR SERVICIOS
        ('📦 Cargando servicios para negocio ID:', empresa.IdNegocio);
        const serviciosRes = await axios.get(`${API_BASE_URL}/servicios?idNegocio=${empresa.IdNegocio}`);
        (' Servicios cargados:', serviciosRes.data);
        
        if (!isMounted) return;
        setServicios(serviciosRes.data);

        // CARGAR TÉCNICOS
        ('👥 Cargando técnicos para negocio ID:', empresa.IdNegocio);
        const personalRes = await axios.get(`${API_BASE_URL}/Personal/by-negocio/${empresa.IdNegocio}`);
        (' Técnicos cargados:', personalRes.data);
        
        if (!isMounted) return;
        const tecnicosConNombres = personalRes.data.map(persona => ({
          IdPersonal: persona.IdPersonal,
          IdUsuario: persona.IdUsuario,
          Nombre: persona.Nombre,
          RolEnNegocio: persona.RolEnNegocio
        }));

        setTecnicos(tecnicosConNombres);

        // OBTENER HORARIOS DISPONIBLES DESDE LA API
        ('🕐 Obteniendo horarios disponibles...');
        await obtenerHorariosDisponibles(empresa.IdNegocio);

        if (!isMounted) return;

        // Establecer valores por defecto SOLO si hay datos
        if (serviciosRes.data.length > 0) {
          setSelectedServicio(serviciosRes.data[0]);
          ('🎯 Servicio por defecto:', serviciosRes.data[0]);
        } else {
          Alert.alert(
            'Sin servicios',
            'Este negocio no tiene servicios disponibles para agendar.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
          return;
        }
        
        if (tecnicosConNombres.length > 0) {
          setSelectedTecnico(tecnicosConNombres[0]);
          ('🎯 Técnico por defecto:', tecnicosConNombres[0]);
        }

        (' Carga de datos completada exitosamente');

      } catch (error) {
        console.error(' Error cargando datos iniciales:', error);
        if (isMounted) {
          Alert.alert('Error', 'No se pudieron cargar los datos del negocio');
        }
      } finally {
        if (isMounted) {
          setLoadingData(false);
        }
      }
    };

    cargarDatosIniciales();

    return () => {
      isMounted = false;
    };
  }, [empresa.IdNegocio]); // Solo dependemos del ID del negocio

  // Cargar horarios ocupados
  const cargarHorariosOcupados = async (fecha, tecnicoId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/citas?idTecnico=${tecnicoId}`);
      const citas = res.data.filter(
        c => c.FechaCita === fecha && c.IdTecnico === tecnicoId && c.Estado !== 'cancelada'
      );

      const ocupados = citas.map(c => {
        const hora = c.HoraInicio.split(':').slice(0, 2).join(':');
        return `${fecha} ${hora}`;
      });

      setHorariosOcupados(ocupados);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudieron cargar los horarios ocupados');
    }
  };

  useEffect(() => {
    if (selectedDate && selectedTecnico) {
      cargarHorariosOcupados(selectedDate.format('YYYY-MM-DD'), selectedTecnico.IdPersonal);
    }
  }, [selectedDate, selectedTecnico]);

  const isTimeAvailable = (time) => {
    if (!selectedDate || !selectedTecnico) return false;
    
    const fechaHora = `${selectedDate.format('YYYY-MM-DD')} ${moment(time, 'HH:mm').format('HH:mm')}`;
    
    // Verificar si está en horarios ocupados
    if (horariosOcupados.includes(fechaHora)) return false;

    // Verificar que no sea en el pasado
    const now = moment();
    const selectedDateTime = moment(fechaHora, 'YYYY-MM-DD HH:mm');
    if (selectedDateTime.isBefore(now)) return false;

    return true;
  };

  // FUNCIONES DEL CALENDARIO
  const goToNextMonth = () => {
    setCurrentMonth(prev => prev.clone().add(1, 'month'));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => prev.clone().subtract(1, 'month'));
  };

  // Generar días del calendario
  const generateCalendarDays = () => {
    const days = [];
    const start = currentMonth.clone().startOf('month').startOf('week');
    const end = currentMonth.clone().endOf('month').endOf('week');

    let day = start.clone();
    while (day.isBefore(end)) {
      days.push(day.clone());
      day.add(1, 'day');
    }
    return days;
  };

  const isDateAvailable = (day) => {
    const isPast = day.isBefore(moment(), 'day');
    return !isPast;
  };

  // CONFIRMAR CITA
  const confirmarCita = async () => {
    ('🔍 INICIANDO CONFIRMACIÓN DE CITA');
    ('📋 Estado actual:', {
      selectedTecnico: selectedTecnico?.IdPersonal,
      selectedDate: selectedDate?.format('YYYY-MM-DD'),
      selectedTime: selectedTime,
      selectedServicio: selectedServicio?.IdServicio,
      clienteActual: clienteActual
    });

    if (!selectedTecnico || !selectedDate || !selectedTime || !selectedServicio || !clienteActual) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    
    try {
      const fechaCita = selectedDate.format('YYYY-MM-DD');
      const horaInicio = `${selectedTime}:00`;

      const horaFinMoment = moment(selectedTime, 'HH:mm')
        .add(selectedServicio.DuracionMinutos || 30, 'minutes');
      const horaFin = horaFinMoment.format('HH:mm:ss');

      // VERIFICAR DISPONIBILIDAD DEL TÉCNICO
      ('🔍 Verificando disponibilidad del técnico...');
      
      const citasTecnicoRes = await axios.get(
        `${API_BASE_URL}/citas?idTecnico=${selectedTecnico.IdPersonal}`
      );
      
      const citasExistentes = citasTecnicoRes.data.filter(cita => 
        cita.FechaCita === fechaCita && 
        cita.Estado !== 'cancelada' && 
        cita.Estado !== 'rechazada'
      );

      ('📅 Citas existentes del técnico:', citasExistentes);

      // Verificar solapamiento
      const haySolapamiento = citasExistentes.some(citaExistente => {
        const horaInicioExistente = moment(citaExistente.HoraInicio, 'HH:mm:ss');
        const horaFinExistente = moment(citaExistente.HoraFin, 'HH:mm:ss');
        const horaInicioNueva = moment(horaInicio, 'HH:mm:ss');
        const horaFinNueva = moment(horaFin, 'HH:mm:ss');

        const seSolapan = (
          (horaInicioNueva.isBetween(horaInicioExistente, horaFinExistente, null, '[)')) ||
          (horaFinNueva.isBetween(horaInicioExistente, horaFinExistente, null, '(]')) ||
          (horaInicioExistente.isBetween(horaInicioNueva, horaFinNueva, null, '[)')) ||
          (horaFinExistente.isBetween(horaInicioNueva, horaFinNueva, null, '(]')) ||
          (horaInicioNueva.isSame(horaInicioExistente) && horaFinNueva.isSame(horaFinExistente))
        );

        return seSolapan;
      });

      if (haySolapamiento) {
        Alert.alert(
          'Horario No Disponible ',
          `El técnico ${selectedTecnico.Nombre} ya tiene una cita programada en este horario.\n\nPor favor, selecciona otro horario o técnico.`,
          [{ text: 'Entendido' }]
        );
        setLoading(false);
        return;
      }

      (' Horario disponible, procediendo a crear cita...');

      // FORMATO CORRECTO PARA EL BACKEND
      const nuevaCita = {
        idCliente: Number(clienteActual.IdCliente),
        idTecnico: Number(selectedTecnico.IdPersonal),  
        idServicio: Number(selectedServicio.IdServicio),
        fechaCita: fechaCita,
        horaInicio: horaInicio,
        horaFin: horaFin,
        estado: 'pendiente',
        motivoCancelacion: null
      };

      ('📤 ENVIANDO CITA:', JSON.stringify(nuevaCita, null, 2));

      const response = await axios.post(`${API_BASE_URL}/citas`, nuevaCita, {
        timeout: 15000,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      (' CITA CREADA EXITOSAMENTE:', response.data);

      Alert.alert(
        '¡Cita Agendada! 🎉',
        `Tu cita para ${selectedServicio.NombreServicio} ha sido agendada para el ${selectedDate.format('DD/MM/YYYY')} a las ${selectedTime} con ${selectedTecnico.Nombre}`,
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );

    } catch (error) {
      console.error(' ERROR AL CREAR CITA:', {
        mensaje: error.message,
        respuesta: error.response?.data,
        estado: error.response?.status,
        config: error.config?.data
      });
      
      let mensajeError = 'No se pudo agendar la cita. ';
      
      if (error.response?.data?.detail) {
        mensajeError += `Error del servidor: ${error.response.data.detail}`;
      } else if (error.response?.data?.message) {
        mensajeError += `Error: ${error.response.data.message}`;
      } else if (error.message) {
        mensajeError += `Error de conexión: ${error.message}`;
      }
      
      Alert.alert('Error', mensajeError);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#246BFD" />
        <Text style={[themeStyles.text, { marginTop: 10 }]}>Cargando datos del negocio...</Text>
      </View>
    );
  }

  // Si no hay servicios, mostrar mensaje
  if (servicios.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Ionicons name="alert-circle-outline" size={64} color="#64748B" />
        <Text style={[themeStyles.text, { fontSize: 18, textAlign: 'center', marginTop: 16 }]}>
          Este negocio no tiene servicios disponibles
        </Text>
        <Text style={[themeStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
          No se pueden agendar citas en este momento
        </Text>
        <TouchableOpacity
          style={[styles.confirmButton, { marginTop: 20 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.confirmButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const days = generateCalendarDays();

  return (
    <View style={[styles.container, themeStyles.background]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* INFORMACIÓN DEL NEGOCIO */}
        <View style={[styles.section, themeStyles.card]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="business" size={20} color="#0A2A66" />
            <Text style={[styles.sectionTitle, themeStyles.text]}>Negocio</Text>
          </View>
          <Text style={[styles.businessName, themeStyles.text]}>{empresa.Nombre}</Text>
          <Text style={[styles.businessInfo, themeStyles.textSecondary]}>
            ID: {empresa.IdNegocio} | Tel: {empresa.TelefonoContacto}
          </Text>
        </View>

        {/* SERVICIOS */}
        <View style={[styles.section, themeStyles.card]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase" size={20} color="#0A2A66" />
            <Text style={[styles.sectionTitle, themeStyles.text]}>Servicio</Text>
          </View>

          <TouchableOpacity
            style={[styles.servicioSelector, themeStyles.input]}
            onPress={() => setShowServiciosModal(true)}
          >
            <Text style={[styles.servicioSelectorText, themeStyles.text]}>
              {selectedServicio ? selectedServicio.NombreServicio : 'Seleccionar servicio'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#64748B" />
          </TouchableOpacity>

          {/* MODAL SERVICIOS */}
          <Modal visible={showServiciosModal} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, themeStyles.card]}>
                <Text style={[styles.modalTitle, themeStyles.text]}>Selecciona un servicio</Text>
                <FlatList
                  data={servicios}
                  keyExtractor={(item) => item.IdServicio.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.servicioItem}
                      onPress={() => {
                        setSelectedServicio(item);
                        setShowServiciosModal(false);
                      }}
                    >
                      <Text style={[styles.servicioItemText, themeStyles.text]}>
                        {item.NombreServicio} - ${item.Precio}
                      </Text>
                      <Text style={[styles.servicioDuracion, themeStyles.textSecondary]}>
                        {item.DuracionMinutos || 30} min
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.closeTimeButton}
                  onPress={() => setShowServiciosModal(false)}
                >
                  <Text style={styles.closeTimeText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        {/* TÉCNICOS */}
        <View style={[styles.section, themeStyles.card]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={20} color="#0A2A66" />
            <Text style={[styles.sectionTitle, themeStyles.text]}>Técnico</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tecnicosContainer}>
            {tecnicos.map((tecnico) => (
              <TouchableOpacity
                key={tecnico.IdPersonal}
                style={[
                  styles.tecnicoButton,
                  selectedTecnico?.IdPersonal === tecnico.IdPersonal && styles.tecnicoButtonSelected,
                ]}
                onPress={() => setSelectedTecnico(tecnico)}
              >
                <Ionicons
                  name="person-circle"
                  size={20}
                  color={selectedTecnico?.IdPersonal === tecnico.IdPersonal ? "#FFFFFF" : "#0A2A66"}
                />
                <Text style={[
                  styles.tecnicoText,
                  selectedTecnico?.IdPersonal === tecnico.IdPersonal && styles.tecnicoTextSelected,
                ]}>
                  {tecnico.Nombre}
                </Text>
                <Text style={[
                  styles.tecnicoRol,
                  selectedTecnico?.IdPersonal === tecnico.IdPersonal && styles.tecnicoRolSelected,
                ]}>
                  {tecnico.RolEnNegocio}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* CALENDARIO */}
        <View style={[styles.section, themeStyles.card]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={20} color="#0A2A66" />
            <Text style={[styles.sectionTitle, themeStyles.text]}>Selecciona una fecha</Text>
          </View>

          <TouchableOpacity
            style={[styles.dateSelector, themeStyles.input]}
            onPress={() => setShowCalendar(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#64748B" />
            <Text style={[styles.dateSelectorText, themeStyles.text]}>
              {selectedDate ? selectedDate.format('dddd, DD [de] MMMM') : 'Seleccionar fecha'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#64748B" />
          </TouchableOpacity>

          {/* MODAL CALENDARIO */}
          <Modal visible={showCalendar} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, themeStyles.card]}>

                <View style={styles.calendarHeader}>
                  <TouchableOpacity onPress={goToPreviousMonth} style={styles.calendarNavButton}>
                    <Ionicons name="chevron-back" size={24} color="#0A2A66" />
                  </TouchableOpacity>
                  <Text style={[styles.calendarTitle, themeStyles.text]}>
                    {currentMonth.format('MMMM YYYY')}
                  </Text>
                  <TouchableOpacity onPress={goToNextMonth} style={styles.calendarNavButton}>
                    <Ionicons name="chevron-forward" size={24} color="#0A2A66" />
                  </TouchableOpacity>
                </View>

                <View style={styles.calendarGrid}>
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                    <Text key={day} style={[styles.weekDay, themeStyles.textSecondary]}>{day}</Text>
                  ))}

                  {days.map((day) => {
                    const isAvailable = isDateAvailable(day);
                    const isSelected = selectedDate && day.isSame(selectedDate, 'day');
                    const isCurrentMonth = day.month() === currentMonth.month();
                    const isToday = day.isSame(moment(), 'day');

                    return (
                      <TouchableOpacity
                        key={day.format('YYYY-MM-DD')}
                        style={[
                          styles.dayButton,
                          !isCurrentMonth && styles.otherMonthDay,
                          !isAvailable && styles.disabledDay,
                          isToday && styles.todayDay,
                          isSelected && styles.selectedDay,
                        ]}
                        onPress={() => {
                          if (isAvailable) {
                            setSelectedDate(day);
                            setShowCalendar(false);
                          }
                        }}
                        disabled={!isAvailable}
                      >
                        <Text style={[
                          styles.dayText,
                          !isCurrentMonth && styles.otherMonthText,
                          !isAvailable && styles.disabledText,
                          isToday && styles.todayText,
                          isSelected && styles.selectedDayText,
                          themeStyles.text,
                        ]}>
                          {day.date()}
                        </Text>

                        {isToday && <View style={styles.todayIndicator} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  style={styles.closeCalendarButton}
                  onPress={() => setShowCalendar(false)}
                >
                  <Text style={styles.closeCalendarText}>Cerrar</Text>
                </TouchableOpacity>

              </View>
            </View>
          </Modal>
        </View>

        {/* HORARIOS */}
        {selectedDate && (
          <View style={[styles.section, themeStyles.card]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={20} color="#0A2A66" />
              <Text style={[styles.sectionTitle, themeStyles.text]}>
                Horarios disponibles - {selectedDate.format('dddd')}
              </Text>
              <Text style={[styles.horariosInfo, themeStyles.textSecondary]}>
                {horariosDisponibles.length} horarios cargados
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.timeSelector, themeStyles.input]}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color="#64748B" />
              <Text style={[styles.timeSelectorText, themeStyles.text]}>
                {selectedTime || 'Seleccionar horario'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>

            {/* MODAL HORARIOS */}
            <Modal visible={showTimePicker} animationType="slide" transparent>
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, themeStyles.card]}>

                  <Text style={[styles.modalTitle, themeStyles.text]}>Selecciona un horario</Text>
                  <Text style={[styles.modalSubtitle, themeStyles.textSecondary]}>
                    {selectedDate.format('dddd, DD [de] MMMM')}
                  </Text>

                  {loadingHorarios ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#246BFD" />
                      <Text style={[styles.loadingText, themeStyles.text]}>Cargando horarios...</Text>
                    </View>
                  ) : (
                    <FlatList
                      data={horariosDisponibles}
                      numColumns={3}
                      keyExtractor={(item) => item}
                      contentContainerStyle={styles.timeGrid}
                      renderItem={({ item }) => {
                        const isAvailable = isTimeAvailable(item);

                        return (
                          <TouchableOpacity
                            style={[
                              styles.timeSlot,
                              !isAvailable && styles.timeSlotDisabled,
                              selectedTime === item && styles.timeSlotSelected,
                            ]}
                            onPress={() => {
                              if (isAvailable) {
                                setSelectedTime(item);
                                setShowTimePicker(false);
                              }
                            }}
                            disabled={!isAvailable}
                          >
                            <Text style={[
                              styles.timeSlotText,
                              !isAvailable && styles.timeSlotTextDisabled,
                              selectedTime === item && styles.timeSlotTextSelected,
                            ]}>
                              {item}
                            </Text>

                            {!isAvailable && (
                              <Ionicons name="close-circle" size={12} color="#EF4444" style={styles.timeSlotIcon} />
                            )}
                          </TouchableOpacity>
                        );
                      }}
                    />
                  )}

                  <TouchableOpacity
                    style={styles.closeTimeButton}
                    onPress={() => setShowTimePicker(false)}
                  >
                    <Text style={styles.closeTimeText}>Cerrar</Text>
                  </TouchableOpacity>

                </View>
              </View>
            </Modal>

          </View>
        )}

        {/* CONFIRMAR */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedTecnico || !selectedDate || !selectedTime || !selectedServicio) &&
            styles.confirmButtonDisabled,
          ]}
          onPress={confirmarCita}
          disabled={!selectedTecnico || !selectedDate || !selectedTime || !selectedServicio || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.confirmButtonText}>
                {selectedServicio ? `Confirmar Cita - $${selectedServicio.Precio}` : 'Confirmar Cita'}
              </Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}