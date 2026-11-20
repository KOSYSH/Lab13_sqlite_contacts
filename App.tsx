import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { ContactForm } from './src/components/ContactForm';
import { ContactList } from './src/components/ContactList';
import { ContactProvider, useContact } from './src/context/ContactContext';
import { Contact, createIndexes, createTables, getContactById, insertContact, updateContact } from './src/database';

function ContactsScreen() {
  const [ready, setReady] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { refresh } = useContact();

  useEffect(() => {
    const initialize = async () => {
      try {
        await createTables();
        await createIndexes();
        setReady(true);
      } catch {
        Alert.alert('Erreur', 'Impossible d\'initialiser la base de données');
      }
    };
    initialize();
  }, []);

  const selectContact = async (id: number) => {
    try {
      const contact = await getContactById(id);
      setSelectedContact(contact);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger le contact');
    }
  };

  const saveContact = async ({name, phone, email}: {name:string; phone:string; email?:string}) => {
    try {
      if (selectedContact) {
        await updateContact(selectedContact.id, name, phone, email);
      } else {
        await insertContact(name, phone, email);
      }
      setSelectedContact(null);
      refresh();
      Alert.alert('Succès', selectedContact ? 'Contact modifié' : 'Contact ajouté');
    } catch (error) {
      Alert.alert('Erreur', selectedContact ? 'Impossible de modifier le contact' : 'Impossible d\'ajouter le contact');
      throw error;
    }
  };

  if (!ready) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedContact ? 'Modifier le contact' : 'Contacts'}</Text>
      <ContactForm
        key={selectedContact?.id ?? 'new'}
        initialData={selectedContact ? {...selectedContact, email: selectedContact.email ?? undefined} : undefined}
        onSubmit={saveContact}
      />
      {selectedContact ? (
        <Button title="Retour" onPress={() => setSelectedContact(null)} />
      ) : (
        <ContactList onSelect={selectContact} />
      )}
    </View>
  );
}

export default function App() {
  return (
    <ContactProvider>
      <ContactsScreen />
    </ContactProvider>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10, paddingTop: 50},
  title: {fontSize: 24, fontWeight: 'bold', margin: 10},
});
