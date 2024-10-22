import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Client = {
  name: string;
  icon: string;
  color: string;
  image: any;
  models: Model[];
  selected?: boolean;
};

type Model = {
  name: string;
  image: any;
  items: string[];
};

const clients: Client[] = [
  {
    name: 'PAGSEGURO',
    icon: 'wallet',
    color: '#E2E2E2',
    image: require('../../assets/images/pagbank.png'),
    models: [
      {
        name: 'NLP SP930 PAGSEGURO (YELLOW)',
        image: require('../../assets/models/pagseguro.jpg'),
        items: [
          '2/2 PRODUCT LABEL(BRAZIL)',
          '1/2 PRODUCT LABEL(BRAZIL())',
          'LABEL(PN/SN) or LABEL(PN/SN BRAZIL)',
        ],
      },
      {
        name: 'NLP SP930 PAGSEGURO (GREEN)',
        image: require('../../assets/models/maquinha.jpg'),
        items: [
          'LABEL(BOX) or LABEL(PN/SN BRAZIL)',
          'LABEL(BOX) or LABEL(PN/SN BRAZIL)',
          'WEIGHT LABEL',

        ],
      },
      {
        name: 'NLP SP930 PAGSEGURO (BLUE)',
        image: require('../../assets/models/minizinha.webp'),
        items: [
          'LABEL(PN/SN) or  Label(PN/SN Brazil)',
          '2/1 LABEL(CARTON BRAZIL) OR LABEL CARTON BRAZIL',
          '1/2 LABEL(PCBA BRAZIL FOR MA)',
        ],
      },
      {
        name: 'NLP SP930 PAGSEGURO (RED)',
        image: require('../../assets/models/minizinha.webp'),
        items: [
          'Label(PCBA)',
          '2/2 LABEL(PCBA BRAZIL) for IO board',
        ],
      },
    ],
  },
  {
    name: 'NUBANK',
    icon: 'alpha-n-box',
    color: '#9b59b6',
    image: require('../../assets/images/nubank.webp'),
    models: [
      {
        name: 'Model C',
        image: require('../../assets/models/nubank_maquinha.png'),
        items: [
          '1/2 LABEL(PCBA BRAZIL FOR MA)',
          'LABEL(MACINEID)',
          '1/2 PRODUCT LABEL(BRAZIL())',
          'LABEL(PN/SN) or LABEL(PN/SN BRAZIL)',
          'LABEL(BOX) or LABEL(PN/SN BRAZIL)',
          'LABEL(BOX) or LABEL(PN/SN BRAZIL)',
          'WEIGHT LABEL',

        ],
      },
    ],
  },
  {
    name: 'SANTANDER',
    selected: true,
    icon: 'bank',
    color: '#27ae60',
    image: require('../../assets/images/santander.png'),
    models: [
      {
        name: 'Model E',
        image: require('../../assets/models/Santander Maquinha.webp'),
        items: [
          'Label(PCBA)',
          '2/2 LABEL(PCBA BRAZIL) for IO board',
          'Label(IMEI)',
          '2/2 PRODUCT LABEL(BRAZIL)',
          'LABEL(PN/SN) or  Label(PN/SN Brazil)',


        ],
      },
    ],
  },
  {
    name: 'BANCO DO BRASIL',
    icon: 'alpha-b-box',
    color: '#E2E2E2',
    image: require('../../assets/images/bancodobrasil_logo.png'),
    models: [
      {
        name: 'Model G',
        image: require('../../assets/models/maquinha.jpg'),
        items: [
          'Label(PCBA)',
          '2/2 LABEL(PCBA BRAZIL) for IO board',
          'Label(IMEI)',
          '2/2 PRODUCT LABEL(BRAZIL)',


        ],
      },
    ],
  },
];

const Stack = createStackNavigator();

function ClientScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <View style={styles.navSwitch}>
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons name="account" size={50} color="#fff" style={styles.avatarIcon} />
        </View>
        <View style={styles.navIconsContainer}>
          <TouchableOpacity style={styles.navIconWrapper}>
            <MaterialCommunityIcons name="file-document" size={30} color="#fff" style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navIconWrapper}>
            <MaterialCommunityIcons name="file-document-edit" size={30} color="#fff" style={styles.navIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <TextInput style={styles.searchInput} placeholder="Browse" />
          <MaterialCommunityIcons name="filter" size={24} color="#000" style={styles.filterIcon} />
        </View>
        <ScrollView contentContainerStyle={styles.clientList}>
          <View style={styles.clientRow}>
            {clients.map((client, index) => (
              <View key={index} style={styles.clientColumn}>
                <TouchableOpacity
                  style={[styles.clientButton, client.selected === true && styles.selectedClient]}
                  onPress={() => navigation.navigate('ClientDetail', { client })}
                >
                  <Image source={client.image} style={styles.clientImage} />
                  <View style={styles.clientInfo}>
                    <MaterialCommunityIcons name={client.icon as any} size={30} color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.clientText}>{client.name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

function ClientDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { client } = route.params;
  return (
    <View style={styles.detailContainer}>
      <Text style={styles.breadcrumb}>Home / {client.name}</Text>
      <View style={styles.detailContent}>
        <Image source={client.image} style={styles.clientDetailImage} />
        <Text style={styles.clientDetailText}>{client.name}</Text>
        <ScrollView contentContainerStyle={styles.modelList}>
          <View style={styles.modelRow}>
            {client.models.map((model: Model, index: number) => (
              <View key={index} style={styles.modelColumn}>
                <TouchableOpacity
                  style={styles.modelButton}
                  onPress={() => navigation.navigate('ModelDetail', { client, model })}
                >
                  <Image source={model.image} style={styles.modelImage} />
                  <Text style={styles.modelText}>{model.name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

function ModelDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { client, model } = route.params;
  return (
    <View style={styles.detailContainer}>
      <Text style={styles.breadcrumb}>Home / {client.name} / {model.name}</Text>
      <View style={styles.detailContent}>
        <Image source={model.image} style={styles.clientDetailImage} />
        <Text style={styles.clientDetailText}>{model.name}</Text>
        <ScrollView contentContainerStyle={styles.itemList}>



          {model.items.map((item: string, index: number) => (
            <View key={index} style={styles.itemColumn}>


              <TouchableOpacity
                style={styles.itemButton}
                onPress={() => navigation.navigate('ItemDetail', { client, model, item })}
              >
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

function ItemDetailScreen({ route }: { route: any }) {
  const { client, model, item } = route.params;

  return (
    <View style={styles.detailContainer}>
      <Text style={styles.breadcrumb}>Home / {client.name} / {model.name} / {item}</Text>
      <View style={styles.detailContent}>
        <Text style={styles.clientDetailText}>Details for: {item}</Text>
        {/* Add additional item details here */}
      </View>
    </View>
  );
}

export default function App(): JSX.Element {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name="Clients" component={ClientScreen} />
        <Stack.Screen name="ClientDetail" component={ClientDetailScreen} />
        <Stack.Screen name="ModelDetail" component={ModelDetailScreen} />
        <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E5F0FF',
  },
  navSwitch: {
    width: 80,
    backgroundColor: '#35567E',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarIcon: {
    marginBottom: 20,
  },
  navIconsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  navIconWrapper: {
    backgroundColor: '#2A4370',
    borderRadius: 40,
    padding: 15,
    marginBottom: 15,
  },
  navIcon: {
    alignSelf: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  filterIcon: {
    marginLeft: 10,
  },
  clientList: {
    flexDirection: 'column',
  },
  clientRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  clientColumn: {
    width: '48%',
    marginBottom: 15,
  },
  clientButton: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#C4C4C4',
    padding: 15,
    borderRadius: 10,
  },
  selectedClient: {
    backgroundColor: '#27ae60',
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  clientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  clientText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  detailContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  breadcrumb: {
    fontSize: 16,
    color: '#35567E',
    marginBottom: 10,
  },
  detailContent: {
    alignItems: 'center',
  },
  clientDetailImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  clientDetailText: {
    fontSize: 24,
    color: '#35567E',
  },
  modelList: {
    flexDirection: 'column',
  },
  modelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modelColumn: {
    padding: 20,
    marginBottom: 15,
  },
  modelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C4C4C4',
    padding: 15,
    borderRadius: 10,
  },
  modelImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  modelText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  itemList: {
    marginTop: 20,
  },
  itemColumn: {
    width: '48%',
    marginBottom: 15,
  },
  itemButton: {
    padding: 15,
    backgroundColor: '#E5E5E5',
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    color: '#35567E',
  },
});
