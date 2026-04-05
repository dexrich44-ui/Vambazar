import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, getDocs, query, where, setDoc, doc, Timestamp } from 'firebase/firestore';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Driver {
  uid: string;
  displayName: string;
  role: 'driver';
  location: string;
  isOnline: boolean;
  rating: number;
  vehicle: {
    model: string;
    plate: string;
    type: 'economy' | 'premium' | 'luxury' | 'van';
  };
}

export const seedMockDrivers = async () => {
  const driversRef = collection(db, 'users');
  const q = query(driversRef, where('role', '==', 'driver'));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    const mockDrivers: Driver[] = [
      {
        uid: 'driver1',
        displayName: 'João Silva',
        role: 'driver',
        location: 'Talatona, Luanda',
        isOnline: true,
        rating: 4.9,
        vehicle: { model: 'Toyota Corolla', plate: 'LD-12-34-AB', type: 'economy' }
      },
      {
        uid: 'driver2',
        displayName: 'Maria Antónia',
        role: 'driver',
        location: 'Maianga, Luanda',
        isOnline: true,
        rating: 4.8,
        vehicle: { model: 'Hyundai Elantra', plate: 'LD-56-78-CD', type: 'premium' }
      },
      {
        uid: 'driver3',
        displayName: 'Carlos Manuel',
        role: 'driver',
        location: 'Viana, Luanda',
        isOnline: true,
        rating: 4.7,
        vehicle: { model: 'Kia Sportage', plate: 'LD-90-12-EF', type: 'van' }
      },
      {
        uid: 'driver4',
        displayName: 'Bela Santos',
        role: 'driver',
        location: 'Kilamba, Luanda',
        isOnline: true,
        rating: 5.0,
        vehicle: { model: 'Mercedes C-Class', plate: 'LD-34-56-GH', type: 'luxury' }
      }
    ];

    for (const driver of mockDrivers) {
      await setDoc(doc(db, 'users', driver.uid), {
        ...driver,
        createdAt: Timestamp.now()
      });
    }
    console.log("Mock drivers seeded.");
  }
};

export const findNearestDriver = async (userLocation: string): Promise<Driver | null> => {
  try {
    const driversRef = collection(db, 'users');
    const q = query(driversRef, where('role', '==', 'driver'), where('isOnline', '==', true));
    const snapshot = await getDocs(q);
    const drivers = snapshot.docs.map(doc => doc.data() as Driver);

    if (drivers.length === 0) return null;

    const prompt = `
      You are an AI dispatcher for Vambazar Elite in Luanda, Angola.
      User location: "${userLocation}"
      Available drivers:
      ${drivers.map((d, i) => `${i + 1}. Name: ${d.displayName}, Location: ${d.location}, Rating: ${d.rating}, Vehicle: ${d.vehicle.type}`).join('\n')}

      Based on the user's location and the drivers' locations in Luanda, select the best driver (nearest or most suitable).
      Return ONLY the index (1-based) of the selected driver.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const selectedIndex = parseInt(response.text.trim()) - 1;
    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= drivers.length) {
      return drivers[0]; // Fallback to first driver
    }

    return drivers[selectedIndex];
  } catch (error) {
    console.error("Error finding driver with AI:", error);
    return null;
  }
};
