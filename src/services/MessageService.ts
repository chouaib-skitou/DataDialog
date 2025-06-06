// NOTE: Les fonctionnalités de MessageService ont été intégrées dans ThreadService
// pour simplifier la gestion des données en mémoire dans cet exemple.
// Dans une application plus complexe avec une base de données réelle,
// il pourrait être pertinent de séparer les services.

// Ce fichier est conservé pour respecter l'arborescence demandée,
// mais il ne contiendra pas de logique active pour le moment.

import { v4 as uuidv4 } from "uuid"
import type { Message, Annotation } from "./ThreadService" // Importer les types depuis ThreadService

class MessageService {
  // Les méthodes de création et de gestion des messages sont maintenant dans ThreadService.
  // Par exemple, ThreadService.addMessage(...)

  // Cette méthode pourrait être utile si MessageService était indépendant.
  public createMessageObject(
    author: string,
    text: string,
    annotations: Annotation[],
    parentId: string | null = null,
  ): Omit<Message, "messageId" | "timestamp" | "isRead"> {
    return {
      parentId,
      author,
      text,
      annotations,
    }
  }

  // generateUUID est déjà utilisé dans ThreadService, mais on peut le garder ici pour référence
  public generateMessageId(): string {
    return uuidv4()
  }
}

const messageService = new MessageService()
export default messageService
