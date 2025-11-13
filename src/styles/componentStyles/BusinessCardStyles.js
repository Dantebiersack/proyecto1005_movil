import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    backgroundColor: "#fff",

    // Sombra profesional
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },

  distanceBadge: {
    backgroundColor: '#3843c2',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 'bold',
  },

  category: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    opacity: 0.75,
  },

  description: {
    fontSize: 14,
    opacity: 0.75,
    marginBottom: 14,
    lineHeight: 18,
  },

  infoContainer: {
    marginBottom: 14,
    gap: 5
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: "center",
  },

  infoText: {
    fontSize: 13,
    marginLeft: 8,
    opacity: 0.7,
    flex: 1,
  },

  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },

  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 12,
    gap: 6,
  },

  mapButton: {
    backgroundColor: '#3843c2',
  },

  appointmentButton: {
    backgroundColor: '#39b58b',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
