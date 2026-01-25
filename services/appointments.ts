import { ID, Query } from "appwrite";
import { databases } from "./appwrite";
import { type PropertyAppointments } from "@/types/appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "main";
const APPOINTMENTS_COLLECTION_ID = "property_appointments";

export interface CreateAppointmentInput {
  property_id: string;
  user_id: string;
  agent_id?: string;
  appointment_type?: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone?: string;
  notes?: string;
  preferred_date?: string;
  preferred_time?: string;
  meeting_link?: string;
}

export interface AppointmentsResponse {
  appointments: PropertyAppointments[];
  total: number;
}

export interface AppointmentFilters {
  status?: string;
  appointment_type?: string;
  limit?: number;
  offset?: number;
}

/**
 * Appointments Service - CRUD operations for property viewing appointments
 */
export const appointmentsService = {
  /**
   * Get appointment by ID
   */
  async getById(appointmentId: string): Promise<PropertyAppointments | null> {
    try {
      const appointment = await databases.getDocument(
        DATABASE_ID,
        APPOINTMENTS_COLLECTION_ID,
        appointmentId
      );
      return appointment as unknown as PropertyAppointments;
    } catch (error) {
      console.error("Error fetching appointment:", error);
      return null;
    }
  },

  /**
   * Get all appointments for a user (as visitor)
   */
  async getUserAppointments(
    userId: string,
    filters: AppointmentFilters = {}
  ): Promise<AppointmentsResponse> {
    try {
      const queries = [
        Query.equal("user_id", userId),
        Query.orderDesc("$createdAt"),
      ];

      if (filters.status) {
        queries.push(Query.equal("status", filters.status));
      }
      if (filters.appointment_type) {
        queries.push(Query.equal("appointment_type", filters.appointment_type));
      }
      if (filters.limit) {
        queries.push(Query.limit(filters.limit));
      }
      if (filters.offset) {
        queries.push(Query.offset(filters.offset));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        APPOINTMENTS_COLLECTION_ID,
        queries
      );

      return {
        appointments: response.documents as unknown as PropertyAppointments[],
        total: response.total,
      };
    } catch (error) {
      console.error("Error fetching user appointments:", error);
      return { appointments: [], total: 0 };
    }
  },

  /**
   * Get all appointments for an agent
   */
  async getAgentAppointments(
    agentId: string,
    filters: AppointmentFilters = {}
  ): Promise<AppointmentsResponse> {
    try {
      const queries = [
        Query.equal("agent_id", agentId),
        Query.orderDesc("$createdAt"),
      ];

      if (filters.status) {
        queries.push(Query.equal("status", filters.status));
      }
      if (filters.appointment_type) {
        queries.push(Query.equal("appointment_type", filters.appointment_type));
      }
      if (filters.limit) {
        queries.push(Query.limit(filters.limit));
      }
      if (filters.offset) {
        queries.push(Query.offset(filters.offset));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        APPOINTMENTS_COLLECTION_ID,
        queries
      );

      return {
        appointments: response.documents as unknown as PropertyAppointments[],
        total: response.total,
      };
    } catch (error) {
      console.error("Error fetching agent appointments:", error);
      return { appointments: [], total: 0 };
    }
  },

  /**
   * Get appointments for a property
   */
  async getPropertyAppointments(
    propertyId: string,
    filters: AppointmentFilters = {}
  ): Promise<AppointmentsResponse> {
    try {
      const queries = [
        Query.equal("property_id", propertyId),
        Query.orderDesc("$createdAt"),
      ];

      if (filters.status) {
        queries.push(Query.equal("status", filters.status));
      }
      if (filters.limit) {
        queries.push(Query.limit(filters.limit));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        APPOINTMENTS_COLLECTION_ID,
        queries
      );

      return {
        appointments: response.documents as unknown as PropertyAppointments[],
        total: response.total,
      };
    } catch (error) {
      console.error("Error fetching property appointments:", error);
      return { appointments: [], total: 0 };
    }
  },

  /**
   * Create a new appointment
   */
  async create(input: CreateAppointmentInput): Promise<PropertyAppointments | null> {
    try {
      const appointment = await databases.createDocument(
        DATABASE_ID,
        APPOINTMENTS_COLLECTION_ID,
        ID.unique(),
        {
          property_id: input.property_id,
          user_id: input.user_id,
          agent_id: input.agent_id || null,
          appointment_type: input.appointment_type || "viewing",
          status: "scheduled",
          visitor_name: input.visitor_name,
          visitor_email: input.visitor_email,
          visitor_phone: input.visitor_phone || null,
          notes: input.notes || null,
          is_confirmed: false,
          duration_minutes: 30,
          meeting_link: input.meeting_link || null,
        }
      );
      return appointment as unknown as PropertyAppointments;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  },

  /**
   * Update an appointment
   */
  async update(
    appointmentId: string,
    data: Partial<PropertyAppointments>
  ): Promise<PropertyAppointments | null> {
    try {
      const appointment = await databases.updateDocument(
        DATABASE_ID,
        APPOINTMENTS_COLLECTION_ID,
        appointmentId,
        data
      );
      return appointment as unknown as PropertyAppointments;
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
  },

  /**
   * Cancel an appointment
   */
  async cancel(
    appointmentId: string,
    reason?: string
  ): Promise<PropertyAppointments | null> {
    try {
      const appointment = await databases.updateDocument(
        DATABASE_ID,
        APPOINTMENTS_COLLECTION_ID,
        appointmentId,
        {
          status: "cancelled",
          cancellation_reason: reason || null,
        }
      );
      return appointment as unknown as PropertyAppointments;
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      throw error;
    }
  },

  /**
   * Confirm an appointment (by agent)
   */
  async confirm(appointmentId: string): Promise<PropertyAppointments | null> {
    try {
      const appointment = await databases.updateDocument(
        DATABASE_ID,
        APPOINTMENTS_COLLECTION_ID,
        appointmentId,
        {
          is_confirmed: true,
          status: "confirmed",
        }
      );
      return appointment as unknown as PropertyAppointments;
    } catch (error) {
      console.error("Error confirming appointment:", error);
      throw error;
    }
  },

  /**
   * Mark appointment as completed
   */
  async complete(
    appointmentId: string,
    agentNotes?: string
  ): Promise<PropertyAppointments | null> {
    try {
      const appointment = await databases.updateDocument(
        DATABASE_ID,
        APPOINTMENTS_COLLECTION_ID,
        appointmentId,
        {
          status: "completed",
          agent_notes: agentNotes || null,
        }
      );
      return appointment as unknown as PropertyAppointments;
    } catch (error) {
      console.error("Error completing appointment:", error);
      throw error;
    }
  },

  /**
   * Delete an appointment
   */
  async delete(appointmentId: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        APPOINTMENTS_COLLECTION_ID,
        appointmentId
      );
      return true;
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return false;
    }
  },

  /**
   * Check if user has an existing appointment for a property
   */
  async hasExistingAppointment(
    propertyId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        APPOINTMENTS_COLLECTION_ID,
        [
          Query.equal("property_id", propertyId),
          Query.equal("user_id", userId),
          Query.notEqual("status", "cancelled"),
          Query.notEqual("status", "completed"),
          Query.limit(1),
        ]
      );
      return response.documents.length > 0;
    } catch (error) {
      console.error("Error checking existing appointment:", error);
      return false;
    }
  },
};
