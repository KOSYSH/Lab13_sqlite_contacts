import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Contact, deleteContact, getAllContacts } from '../database';
import { useContact } from '../context/ContactContext';

export const ContactList: React.FC<{onSelect:(id:number)=>void}> = ({onSelect}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { refresh, refreshKey } = useContact();

  const load = async () => {
    try {
      const data = await getAllContacts();
      setContacts(data);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les contacts');
    }
  };

  useEffect(() => { load(); }, [refreshKey]);

  const renderItem = ({item}: {item:Contact}) => (
    <View style={styles.row}>
      <TouchableOpacity style={styles.item} onPress={() => onSelect(item.id)}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>{item.phone}</Text>
      </TouchableOpacity>
      <Button title="X" color="red" onPress={async () => {
        try {
          await deleteContact(item.id);
          refresh();
        } catch {
          Alert.alert('Erreur', 'Impossible de supprimer le contact');
        }
      }} />
    </View>
  );

  return (
    <FlatList data={contacts} keyExtractor={item => item.id.toString()} renderItem={renderItem} ListEmptyComponent={<Text>Aucun contact</Text>} />
  );
};

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center'},
  item: {flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#eee'},
  name: {fontWeight: 'bold'},
});
