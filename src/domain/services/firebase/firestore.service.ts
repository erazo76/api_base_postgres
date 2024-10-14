import { Injectable } from "@nestjs/common";
import { Firestore } from "@google-cloud/firestore";

@Injectable()
export class FirestoreService {
  private readonly firestore: Firestore;

  constructor() {
    this.firestore = new Firestore({
      projectId: "chat-pa-a5af1",
      credentials: {
        client_email:
          "firebase-adminsdk-omumx@chat-pa-a5af1.iam.gserviceaccount.com",
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/2k6my9su9swn\n/oLlX65bcQ3OYjGzBKbpKnKzX+zY64t/nGJkn3JTIodorpLkh6gl2cg4kPrcblzA\n80uDKaIHDvJR978+ugrV9v9NlUv5Ox/pMwZas/WUbyYYmb2N004n0asFpbjONllw\nSmHzL0d5HblwkefF/TquGnoJtNzqg9Iucqh1Xe/0E4/QRmwYl3O3pbAKXKA0hw1f\nTH5KO+VW2ZI4HnkSHW3wsuiR+3J5nH+Nlb/YhUp79K2lWi4HIUSfgTQT+pGDYoTJ\nWc6OnVqndOPFzpXSp7GKg8aDIpE1wkow9t4ljcfKB9lGQb7AviW+rhqw9xngAbEU\nQuOAIZ8BAgMBAAECggEAB0EL5Eak/Pub8I8xB9c8UnzN1tXjpy8v2HUgbSPdYr5V\nQff5yHA29GnD0PN43mc6tmOrrGfe9GK/4xPP8R+r3rRz+SFy+74xFrIGKTrR6pSP\nulORk/BmArzJJfj6L9ijheHpo4cGm9V2QEavuXA6NZwoHNeHefb/NwINRzytdbiB\ndrHuNJTqMO+hCGMwsGhN/GrvzvCJp50udtSqZ3hMehpWLUrL7FZEY5t44dlaMJvS\nv6nZe3TGFxZ2aFVLCFFJSxokIBF77CSWMpGO9UZ8rPifrkwEzOGvIUhRrTQOm3GZ\nrUCnlYVhMEO0R52yKaqwNejW+EghtKIju0/CtOvDGQKBgQDOXRtUA6Zq8RU5YvIV\nYxxPLCC9a787/LKrcjVWXxJYyAbrAnpLH8B8H/J99DwxUfVKd03bJE1EIlsm+M+T\nINqsf/4bGOnoA8qYkeS8BxZpDcT5z7w79FKnOwDIfzhUpAhk/+bYFMxXw4h8c5/Y\nTbrWivaayoNabmRBfb36FszLawKBgQDt/6+rYKiQLzp3e/nvcPzbvaHZ1pKV/1Yh\ndcFIIxVOUwaxKmIkiCRBlUKJDygBhT/28q5B9eWhiNuyMDAr/FnZlLka0ZM+7APy\n6mn2waTokKsYJgnELxHjXdNEhX38+35GAetdp0ffbevH69ekz31u9Z9w6GePBB+R\nUs0FByOmQwKBgQCtF+XDS6h8TSmLUBZUoCRvuEjh+Y2XSHepXQumHeqqs2UyHIrt\nln2C390rjwAqMl+4DWgtpz50JwkkIFEkTMt/I4DFw9j29q8p2D3vBVbj2VveWkO+\nWko14UTf5+4c+NXdudQsbQ2Vk/pYwTdTXKeaK0d8QN96q9vGHy2JpzQybwKBgQCF\nQi/DPnjDWp5a/oDAL7x08SXpifpDoFdCnuNdF7+7PkO1+SxAljXuvrslcOYOi+R3\nygQGDL/JhY61o8OlLUPFzz8hpAzVI2NGpTg1oNFMIoyaFdpMDarvar57VF9pwgs+\n+Z4mrx5QHQTyyLvSnRb3hPIETyyE6GMghIMk+I1ebwKBgEXkZ/Sq2yJ9/19xyIuK\nrWtNGws/XON3+xzXSOYEj0asjRJrJ1M6jGtak0LTw35sHTq/wwlzXKgUvJgCMCjG\nZ1fHwG+x93VrCaSkiJYWvBwQl0Wzgq9wHm0sqAwCwH9y0Rpm9CaM9fQon0Ah+WhS\nxAQh+8rI/mSr79QpmuSq/CUJ\n-----END PRIVATE KEY-----\n",
      },
    });
  }

  async getCollection(collectionPath: string) {
    return this.firestore.collection(collectionPath);
  }

  async getDocument(documentPath: string) {
    return this.firestore.doc(documentPath);
  }

  async addDocument(collectionPath: string, data: any) {
    return this.firestore.collection(collectionPath).add(data);
  }

  async updateDocument(documentPath: string, data: any) {
    return this.firestore.doc(documentPath).update(data);
  }

  async deleteDocument(documentPath: string) {
    return this.firestore.doc(documentPath).delete();
  }
}
