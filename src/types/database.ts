export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            credits: {
                Row: {
                    user_id: string
                    balance: number
                    plan_type: 'free' | 'starter' | 'pro' | 'business'
                    cycle_start: string
                    cycle_end: string
                    stripe_customer_id: string | null
                    stripe_subscription_id: string | null
                    updated_at: string
                }
                Insert: {
                    user_id: string
                    balance?: number
                    plan_type?: 'free' | 'starter' | 'pro' | 'business'
                    cycle_start?: string
                    cycle_end?: string
                    stripe_customer_id?: string | null
                    stripe_subscription_id?: string | null
                    updated_at?: string
                }
                Update: {
                    user_id?: string
                    balance?: number
                    plan_type?: 'free' | 'starter' | 'pro' | 'business'
                    cycle_start?: string
                    cycle_end?: string
                    stripe_customer_id?: string | null
                    stripe_subscription_id?: string | null
                    updated_at?: string
                }
            }
            credit_ledger: {
                Row: {
                    id: string
                    user_id: string
                    amount: number
                    reason: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    amount: number
                    reason: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    amount?: number
                    reason?: string
                    created_at?: string
                }
            }
            clips: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    source_url: string
                    template_id: string
                    status: 'pending' | 'processing' | 'completed' | 'failed'
                    preview_url: string | null
                    duration: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    source_url: string
                    template_id: string
                    status?: 'pending' | 'processing' | 'completed' | 'failed'
                    preview_url?: string | null
                    duration?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    source_url?: string
                    template_id?: string
                    status?: 'pending' | 'processing' | 'completed' | 'failed'
                    preview_url?: string | null
                    duration?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            clip_assets: {
                Row: {
                    id: string
                    clip_id: string
                    captions: Json | null
                    format_settings: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    clip_id: string
                    captions?: Json | null
                    format_settings?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    clip_id?: string
                    captions?: Json | null
                    format_settings?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            exports: {
                Row: {
                    id: string
                    clip_id: string
                    user_id: string
                    status: 'pending' | 'processing' | 'completed' | 'failed'
                    download_url: string | null
                    watermarked: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    clip_id: string
                    user_id: string
                    status?: 'pending' | 'processing' | 'completed' | 'failed'
                    download_url?: string | null
                    watermarked?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    clip_id?: string
                    user_id?: string
                    status?: 'pending' | 'processing' | 'completed' | 'failed'
                    download_url?: string | null
                    watermarked?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
