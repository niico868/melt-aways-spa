export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          action_label: string | null
          created_at: string
          dismissed: boolean
          id: string
          kind: string
          message: string
        }
        Insert: {
          action_label?: string | null
          created_at?: string
          dismissed?: boolean
          id?: string
          kind?: string
          message: string
        }
        Update: {
          action_label?: string | null
          created_at?: string
          dismissed?: boolean
          id?: string
          kind?: string
          message?: string
        }
        Relationships: []
      }
      appointment_medical: {
        Row: {
          additional_notes: string | null
          allergies: string | null
          appointment_id: string
          contraindications: string | null
          medications: string | null
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          allergies?: string | null
          appointment_id: string
          contraindications?: string | null
          medications?: string | null
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          allergies?: string | null
          appointment_id?: string
          contraindications?: string | null
          medications?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_medical_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_notes: {
        Row: {
          appointment_id: string
          author_id: string | null
          author_name: string | null
          body: string
          created_at: string
          id: string
          kind: string
        }
        Insert: {
          appointment_id: string
          author_id?: string | null
          author_name?: string | null
          body: string
          created_at?: string
          id?: string
          kind: string
        }
        Update: {
          appointment_id?: string
          author_id?: string | null
          author_name?: string | null
          body?: string
          created_at?: string
          id?: string
          kind?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_notes_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_services: {
        Row: {
          appointment_id: string
          created_at: string
          duration_min_snapshot: number
          id: string
          price_snapshot: number
          service_id: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          duration_min_snapshot?: number
          id?: string
          price_snapshot?: number
          service_id: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          duration_min_snapshot?: number
          id?: string
          price_snapshot?: number
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_services_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          created_at: string
          customer_id: string | null
          duration_min: number | null
          employee_id: string | null
          id: string
          quick_note: string | null
          room: string | null
          scheduled_at: string
          service_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          duration_min?: number | null
          employee_id?: string | null
          id?: string
          quick_note?: string | null
          room?: string | null
          scheduled_at: string
          service_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          duration_min?: number | null
          employee_id?: string | null
          id?: string
          quick_note?: string | null
          room?: string | null
          scheduled_at?: string
          service_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_email: string | null
          created_at: string
          diff: Json | null
          entity: string | null
          entity_id: string | null
          id: string
          ip: string | null
          summary: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          created_at?: string
          diff?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: string
          ip?: string | null
          summary?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          created_at?: string
          diff?: Json | null
          entity?: string | null
          entity_id?: string | null
          id?: string
          ip?: string | null
          summary?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      client_events: {
        Row: {
          created_at: string
          customer_id: string
          event_type: string
          from_status: Database["public"]["Enums"]["client_status"] | null
          id: string
          metadata: Json
          to_status: Database["public"]["Enums"]["client_status"] | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          event_type: string
          from_status?: Database["public"]["Enums"]["client_status"] | null
          id?: string
          metadata?: Json
          to_status?: Database["public"]["Enums"]["client_status"] | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          event_type?: string
          from_status?: Database["public"]["Enums"]["client_status"] | null
          id?: string
          metadata?: Json
          to_status?: Database["public"]["Enums"]["client_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "client_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          category: string
          client_name: string
          consultation_type: string | null
          created_at: string
          customer_id: string | null
          form_data: Json
          id: string
          programme_interest: string | null
          service_id: string | null
          service_name: string | null
          source: string
          status: string
          submitted_at: string
        }
        Insert: {
          category?: string
          client_name: string
          consultation_type?: string | null
          created_at?: string
          customer_id?: string | null
          form_data?: Json
          id?: string
          programme_interest?: string | null
          service_id?: string | null
          service_name?: string | null
          source?: string
          status?: string
          submitted_at?: string
        }
        Update: {
          category?: string
          client_name?: string
          consultation_type?: string | null
          created_at?: string
          customer_id?: string | null
          form_data?: Json
          id?: string
          programme_interest?: string | null
          service_id?: string | null
          service_name?: string | null
          source?: string
          status?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_notes: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          customer_id: string
          id: string
          pinned: boolean
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          customer_id: string
          id?: string
          pinned?: boolean
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          customer_id?: string
          id?: string
          pinned?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_treatments: {
        Row: {
          after_photo_url: string | null
          appointment_id: string | null
          before_photo_url: string | null
          created_at: string
          customer_id: string
          employee_id: string | null
          employee_name: string | null
          id: string
          outcome_notes: string | null
          performed_at: string
          price: number | null
          service_id: string | null
          service_name: string
          session_number: number | null
          status: Database["public"]["Enums"]["treatment_status"]
          treatment_plan_id: string | null
        }
        Insert: {
          after_photo_url?: string | null
          appointment_id?: string | null
          before_photo_url?: string | null
          created_at?: string
          customer_id: string
          employee_id?: string | null
          employee_name?: string | null
          id?: string
          outcome_notes?: string | null
          performed_at?: string
          price?: number | null
          service_id?: string | null
          service_name: string
          session_number?: number | null
          status?: Database["public"]["Enums"]["treatment_status"]
          treatment_plan_id?: string | null
        }
        Update: {
          after_photo_url?: string | null
          appointment_id?: string | null
          before_photo_url?: string | null
          created_at?: string
          customer_id?: string
          employee_id?: string | null
          employee_name?: string | null
          id?: string
          outcome_notes?: string | null
          performed_at?: string
          price?: number | null
          service_id?: string | null
          service_name?: string
          session_number?: number | null
          status?: Database["public"]["Enums"]["treatment_status"]
          treatment_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_treatments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_treatments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_treatments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_treatments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_treatments_treatment_plan_id_fkey"
            columns: ["treatment_plan_id"]
            isOneToOne: false
            referencedRelation: "treatment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          allergies: string | null
          city: string | null
          client_status: Database["public"]["Enums"]["client_status"]
          client_status_changed_at: string
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string
          id: string
          last_activity_at: string
          marketing_opt_in: boolean | null
          medical_conditions: string | null
          medical_notes: string | null
          medications: string | null
          notes: string | null
          phone: string | null
          preferred_contact: string | null
          skin_type: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          allergies?: string | null
          city?: string | null
          client_status?: Database["public"]["Enums"]["client_status"]
          client_status_changed_at?: string
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name: string
          id?: string
          last_activity_at?: string
          marketing_opt_in?: boolean | null
          medical_conditions?: string | null
          medical_notes?: string | null
          medications?: string | null
          notes?: string | null
          phone?: string | null
          preferred_contact?: string | null
          skin_type?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          allergies?: string | null
          city?: string | null
          client_status?: Database["public"]["Enums"]["client_status"]
          client_status_changed_at?: string
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string
          id?: string
          last_activity_at?: string
          marketing_opt_in?: boolean | null
          medical_conditions?: string | null
          medical_notes?: string | null
          medications?: string | null
          notes?: string | null
          phone?: string | null
          preferred_contact?: string | null
          skin_type?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          avatar_tone: string
          created_at: string
          full_name: string
          id: string
          role: string
          slots_total: number
        }
        Insert: {
          avatar_tone?: string
          created_at?: string
          full_name: string
          id?: string
          role?: string
          slots_total?: number
        }
        Update: {
          avatar_tone?: string
          created_at?: string
          full_name?: string
          id?: string
          role?: string
          slots_total?: number
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          kind: string
          line_discount: number
          line_total: number | null
          quantity: number
          service_id: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          kind?: string
          line_discount?: number
          line_total?: number | null
          quantity?: number
          service_id?: string | null
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          kind?: string
          line_discount?: number
          line_total?: number | null
          quantity?: number
          service_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          appointment_id: string | null
          created_at: string
          customer_id: string | null
          discount: number
          due_date: string | null
          id: string
          invoice_number: string
          notes: string | null
          staff_id: string | null
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string
          void_reason: string | null
          voided_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          customer_id?: string | null
          discount?: number
          due_date?: string | null
          id?: string
          invoice_number?: string
          notes?: string | null
          staff_id?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          void_reason?: string | null
          voided_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          customer_id?: string | null
          discount?: number
          due_date?: string | null
          id?: string
          invoice_number?: string
          notes?: string | null
          staff_id?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          void_reason?: string | null
          voided_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          id: string
          invoice_id: string
          kind: string
          method: string
          note: string | null
          recorded_at: string
          recorded_by: string | null
        }
        Insert: {
          amount: number
          id?: string
          invoice_id: string
          kind?: string
          method?: string
          note?: string | null
          recorded_at?: string
          recorded_by?: string | null
        }
        Update: {
          amount?: number
          id?: string
          invoice_id?: string
          kind?: string
          method?: string
          note?: string | null
          recorded_at?: string
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          role?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          base_price: number
          created_at: string
          fill_color: string
          id: string
          name: string
        }
        Insert: {
          base_price?: number
          created_at?: string
          fill_color?: string
          id?: string
          name: string
        }
        Update: {
          base_price?: number
          created_at?: string
          fill_color?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      treatment_plans: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          name: string
          status: Database["public"]["Enums"]["treatment_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["treatment_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["treatment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_plans_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      customer_has_active_treatment: {
        Args: { _customer_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      public_submit_consultation: {
        Args: {
          p_areas?: string
          p_concern?: string
          p_email: string
          p_full_name: string
          p_location?: string
          p_notes?: string
          p_phone: string
          p_preferred_date?: string
          p_preferred_time?: string
          p_suggested_package?: string
        }
        Returns: string
      }
      recompute_invoice: { Args: { _invoice_id: string }; Returns: undefined }
      set_client_status: {
        Args: {
          _customer_id: string
          _event: string
          _metadata?: Json
          _new: Database["public"]["Enums"]["client_status"]
        }
        Returns: undefined
      }
      sweep_client_activity: { Args: never; Returns: undefined }
      upsert_customer_by_contact: {
        Args: {
          p_email?: string
          p_full_name: string
          p_notes?: string
          p_phone?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "manager" | "receptionist"
      client_status:
        | "lead"
        | "registered"
        | "consultation_booked"
        | "consultation_completed"
        | "active_treatment"
        | "treatment_plan_completed"
        | "maintenance"
        | "inactive"
        | "archived"
      treatment_status:
        | "Planned"
        | "Scheduled"
        | "In Progress"
        | "Completed"
        | "Paused"
        | "Discontinued"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "manager", "receptionist"],
      client_status: [
        "lead",
        "registered",
        "consultation_booked",
        "consultation_completed",
        "active_treatment",
        "treatment_plan_completed",
        "maintenance",
        "inactive",
        "archived",
      ],
      treatment_status: [
        "Planned",
        "Scheduled",
        "In Progress",
        "Completed",
        "Paused",
        "Discontinued",
      ],
    },
  },
} as const
