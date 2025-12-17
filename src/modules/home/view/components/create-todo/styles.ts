import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  sheet: {
    backgroundColor: '#3A3A3A',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
  },
  description: {
    minHeight: 44,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  submitBtn: {
    marginLeft: 'auto',
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#8B7CFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
});
