export const scenarios = [
  {
    id: 1,
    title: "On the Airplane to Mexico",
    description: "You're on an airplane heading to Mexico and your seatmate wants to chat about your trip.",
    avatar: "https://i.pravatar.cc/300?img=47",
    avatarName: "Carlos",
    duration: 300, // 5 minutes in seconds
    words: [
      {
        spanish: "México",
        english: "Mexico"
      },
      {
        spanish: "vacaciones",
        english: "vacation"
      },
      {
        spanish: "semana",
        english: "week"
      },
      {
        spanish: "tiempo",
        english: "time"
      },
      {
        spanish: "primera vez",
        english: "first time"
      },
      {
        spanish: "emocionado",
        english: "excited"
      }
    ],
    phrases: [
      {
        spanish: "¿A dónde vas?",
        english: "Where are you going?"
      },
      {
        spanish: "Voy a México de vacaciones",
        english: "I'm going to Mexico on vacation"
      },
      {
        spanish: "Es mi primera vez",
        english: "It's my first time"
      },
      {
        spanish: "¿Cuánto tiempo vas a estar?",
        english: "How long will you stay?"
      },
      {
        spanish: "Una semana",
        english: "One week"
      },
      {
        spanish: "Estoy emocionado",
        english: "I'm excited"
      }
    ],
    goals: [
      {
        id: 1,
        content: "Tell Carlos where you're going",
        completed: false
      },
      {
        id: 2,
        content: "Explain how long you'll be staying",
        completed: false
      },
      {
        id: 3,
        content: "Mention it's your first time visiting",
        completed: false
      },
      {
        id: 4,
        content: "Express your excitement about the trip",
        completed: false
      }
    ],
    aiResponses: [
      "¡Hola! ¿A dónde vas?",
      "¡Qué emocionante! ¿Es tu primera vez en México?",
      "¿Cuánto tiempo vas a estar allá?",
      "¡Excelente! Vas a disfrutar mucho. ¿Qué lugares vas a visitar?",
      "¡Perfecto! Te va a encantar México."
    ]
  },
  {
    id: 2,
    title: "Ordering at a Restaurant",
    description: "You're at a local restaurant in Mexico City and need to order food.",
    avatar: "https://i.pravatar.cc/300?img=33",
    avatarName: "María",
    duration: 300,
    words: [
      {
        spanish: "ordenar",
        english: "to order"
      },
      {
        spanish: "cuenta",
        english: "check/bill"
      },
      {
        spanish: "delicioso",
        english: "delicious"
      },
      {
        spanish: "recomendar",
        english: "to recommend"
      },
      {
        spanish: "opciones",
        english: "options"
      },
      {
        spanish: "vegetariano",
        english: "vegetarian"
      }
    ],
    phrases: [
      {
        spanish: "¿Qué me recomienda?",
        english: "What do you recommend?"
      },
      {
        spanish: "Quisiera ordenar",
        english: "I would like to order"
      },
      {
        spanish: "La cuenta, por favor",
        english: "The check, please"
      },
      {
        spanish: "¿Tiene opciones vegetarianas?",
        english: "Do you have vegetarian options?"
      },
      {
        spanish: "Está delicioso",
        english: "It's delicious"
      }
    ],
    goals: [
      {
        id: 1,
        content: "Greet the server",
        completed: false
      },
      {
        id: 2,
        content: "Ask for a recommendation",
        completed: false
      },
      {
        id: 3,
        content: "Place your order",
        completed: false
      },
      {
        id: 4,
        content: "Ask for the check",
        completed: false
      }
    ],
    aiResponses: [
      "¡Buenas tardes! Bienvenido a nuestro restaurante.",
      "Nuestra especialidad son los tacos al pastor. ¿Le gustaría probarlos?",
      "¡Excelente elección! ¿Algo para beber?",
      "Claro, aquí tiene la cuenta.",
      "¡Gracias por venir! ¡Que tenga un buen día!"
    ]
  },
  {
    id: 3,
    title: "Checking into a Hotel",
    description: "You've just arrived at your hotel in Cancún and need to check in.",
    avatar: "https://i.pravatar.cc/300?img=28",
    avatarName: "Roberto",
    duration: 300,
    words: [
      {
        spanish: "reservación",
        english: "reservation"
      },
      {
        spanish: "desayuno",
        english: "breakfast"
      },
      {
        spanish: "elevador",
        english: "elevator"
      },
      {
        spanish: "wifi",
        english: "wifi"
      },
      {
        spanish: "contraseña",
        english: "password"
      },
      {
        spanish: "hora",
        english: "time/hour"
      }
    ],
    phrases: [
      {
        spanish: "Tengo una reservación",
        english: "I have a reservation"
      },
      {
        spanish: "¿A qué hora es el desayuno?",
        english: "What time is breakfast?"
      },
      {
        spanish: "¿Dónde está el elevador?",
        english: "Where is the elevator?"
      },
      {
        spanish: "¿Tienen wifi?",
        english: "Do you have wifi?"
      },
      {
        spanish: "¿Cuál es la contraseña?",
        english: "What is the password?"
      }
    ],
    goals: [
      {
        id: 1,
        content: "Tell the receptionist you have a reservation",
        completed: false
      },
      {
        id: 2,
        content: "Ask about breakfast time",
        completed: false
      },
      {
        id: 3,
        content: "Ask about wifi",
        completed: false
      },
      {
        id: 4,
        content: "Find out where the elevator is",
        completed: false
      }
    ],
    aiResponses: [
      "¡Bienvenido! ¿Tiene una reservación?",
      "Perfecto, déjeme buscar su reserva. ¿Su nombre, por favor?",
      "El desayuno es de 7 a 10 de la mañana en el restaurante del primer piso.",
      "Sí, tenemos wifi gratis. La contraseña es 'Hotel2024'.",
      "El elevador está justo detrás de usted, a la derecha. ¡Disfrute su estadía!"
    ]
  }
];
