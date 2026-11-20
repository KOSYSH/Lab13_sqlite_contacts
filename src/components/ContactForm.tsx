import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

type Props = {
  initialData?: {name:string; phone:string; email?:string};
  onSubmit: (data:{name:string; phone:string; email?:string}) => Promise<void>;
};

export const ContactForm: React.FC<Props> = ({initialData, onSubmit}) => {
  const [name, setName] = useState(initialData?.name ?? '');
  const [phone, setPhone] = useState(initialData?.phone ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');

  const handlePress = async () => {
    if (!name || !phone) {
      alert('Nom et téléphone obligatoires');
      return;
    }
    try {
      await onSubmit({name, phone, email});
      setName('');
      setPhone('');
      setEmail('');
    } catch {
      // L'écran affiche l'alerte correspondant à l'opération.
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nom" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Téléphone" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
      <TextInput placeholder="Email (optionnel)" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <Button title="Enregistrer" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {margin: 10},
  input: {borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10},
});
