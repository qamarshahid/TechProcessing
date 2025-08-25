--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Postgres.app)
-- Dumped by pg_dump version 17.5 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: invoices_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.invoices_status_enum AS ENUM (
    'DRAFT',
    'SENT',
    'PAID',
    'OVERDUE',
    'CANCELLED'
);


ALTER TYPE public.invoices_status_enum OWNER TO postgres;

--
-- Name: payments_method_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payments_method_enum AS ENUM (
    'CARD',
    'ZELLE',
    'CASHAPP',
    'BANK_TRANSFER'
);


ALTER TYPE public.payments_method_enum OWNER TO postgres;

--
-- Name: payments_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payments_status_enum AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public.payments_status_enum OWNER TO postgres;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_role_enum AS ENUM (
    'ADMIN',
    'CLIENT',
    'AGENT'
);


ALTER TYPE public.users_role_enum OWNER TO postgres;

--
-- Name: auto_expire_payment_links(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.auto_expire_payment_links() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE payment_links 
  SET status = 'EXPIRED', updated_at = now()
  WHERE status = 'ACTIVE' AND expires_at < now();
END;
$$;


ALTER FUNCTION public.auto_expire_payment_links() OWNER TO postgres;

--
-- Name: generate_secure_token(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_secure_token() RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
  chars text := 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..32 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;


ALTER FUNCTION public.generate_secure_token() OWNER TO postgres;

--
-- Name: update_agent_stats(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_agent_stats() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update agent statistics when sale status changes
    IF TG_OP = 'UPDATE' AND OLD.sale_status != NEW.sale_status THEN
        UPDATE agents 
        SET 
            total_sales = (
                SELECT COUNT(*) 
                FROM agent_sales 
                WHERE agent_id = NEW.agent_id 
                AND sale_status = 'APPROVED'
            ),
            total_sales_value = (
                SELECT COALESCE(SUM(sale_amount), 0) 
                FROM agent_sales 
                WHERE agent_id = NEW.agent_id 
                AND sale_status = 'APPROVED'
            ),
            total_earnings = (
                SELECT COALESCE(SUM(total_commission), 0) 
                FROM agent_sales 
                WHERE agent_id = NEW.agent_id 
                AND sale_status = 'APPROVED'
            ),
            total_paid_out = (
                SELECT COALESCE(SUM(total_commission), 0) 
                FROM agent_sales 
                WHERE agent_id = NEW.agent_id 
                AND commission_status = 'PAID'
            ),
            pending_commission = (
                SELECT COALESCE(SUM(total_commission), 0) 
                FROM agent_sales 
                WHERE agent_id = NEW.agent_id 
                AND sale_status = 'APPROVED'
            ) - (
                SELECT COALESCE(SUM(total_commission), 0) 
                FROM agent_sales 
                WHERE agent_id = NEW.agent_id 
                AND commission_status = 'PAID'
            ),
            updated_at = NOW()
        WHERE id = NEW.agent_id;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_agent_stats() OWNER TO postgres;

--
-- Name: update_next_billing_date(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_next_billing_date() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.frequency = 'MONTHLY' THEN
    NEW.next_billing_date := NEW.start_date + INTERVAL '1 month';
  ELSIF NEW.frequency = 'QUARTERLY' THEN
    NEW.next_billing_date := NEW.start_date + INTERVAL '3 months';
  ELSIF NEW.frequency = 'YEARLY' THEN
    NEW.next_billing_date := NEW.start_date + INTERVAL '1 year';
  END IF;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_next_billing_date() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: agent_sales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_sales (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agent_id uuid NOT NULL,
    client_id uuid,
    sale_reference character varying(100) NOT NULL,
    client_name character varying(200) NOT NULL,
    client_email character varying(200) NOT NULL,
    client_phone character varying(20),
    service_name character varying(200) NOT NULL,
    service_description text,
    sale_amount numeric(10,2) NOT NULL,
    agent_commission_rate numeric(5,2) NOT NULL,
    closer_commission_rate numeric(5,2) NOT NULL,
    agent_commission numeric(10,2) NOT NULL,
    closer_commission numeric(10,2) NOT NULL,
    total_commission numeric(10,2) NOT NULL,
    sale_status character varying(20) DEFAULT 'PENDING'::character varying,
    commission_status character varying(20) DEFAULT 'PENDING'::character varying,
    sale_date date,
    payment_date date,
    commission_paid_date date,
    notes text,
    client_details jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    closer_name character varying(200) NOT NULL,
    original_sale_id uuid,
    changes_made jsonb,
    resubmission_count integer DEFAULT 0,
    closer_id uuid,
    CONSTRAINT agent_sales_commission_status_check CHECK (((commission_status)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'PAID'::character varying, 'CANCELLED'::character varying])::text[]))),
    CONSTRAINT agent_sales_sale_status_check CHECK (((sale_status)::text = ANY (ARRAY[('PENDING'::character varying)::text, ('APPROVED'::character varying)::text, ('REJECTED'::character varying)::text, ('RESUBMITTED'::character varying)::text, ('PAID'::character varying)::text, ('CANCELLED'::character varying)::text])))
);


ALTER TABLE public.agent_sales OWNER TO postgres;

--
-- Name: agents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    agent_code character varying(100) NOT NULL,
    sales_person_name character varying(100) NOT NULL,
    closer_name character varying(100) NOT NULL,
    agent_commission_rate numeric(5,2) DEFAULT 6.00,
    closer_commission_rate numeric(5,2) DEFAULT 10.00,
    total_earnings numeric(10,2) DEFAULT 0.00,
    total_paid_out numeric(10,2) DEFAULT 0.00,
    pending_commission numeric(10,2) DEFAULT 0.00,
    total_sales integer DEFAULT 0,
    total_sales_value numeric(12,2) DEFAULT 0.00,
    is_active boolean DEFAULT true,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.agents OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    action character varying NOT NULL,
    entity_type character varying NOT NULL,
    entity_id character varying NOT NULL,
    details json,
    ip_address character varying,
    user_agent character varying,
    user_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: closers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.closers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    closer_code character varying(50) NOT NULL,
    closer_name character varying(200) NOT NULL,
    commission_rate numeric(5,2) DEFAULT 0.00,
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    email character varying(255),
    phone character varying(50),
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT closers_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);


ALTER TABLE public.closers OWNER TO postgres;

--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    invoice_number character varying NOT NULL,
    client_id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    tax numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    total numeric(10,2) NOT NULL,
    status public.invoices_status_enum DEFAULT 'DRAFT'::public.invoices_status_enum NOT NULL,
    description text NOT NULL,
    "lineItems" json,
    due_date timestamp without time zone NOT NULL,
    sent_date timestamp without time zone,
    paid_date timestamp without time zone,
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    service_package_id uuid
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: payment_links; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_links (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    client_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    amount numeric(10,2) NOT NULL,
    secure_token text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    allow_partial_payment boolean DEFAULT false,
    used_at timestamp with time zone,
    payment_id uuid,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT payment_links_status_check CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'EXPIRED'::text, 'USED'::text, 'CANCELLED'::text])))
);


ALTER TABLE public.payment_links OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    invoice_id uuid NOT NULL,
    user_id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    method public.payments_method_enum NOT NULL,
    status public.payments_status_enum DEFAULT 'PENDING'::public.payments_status_enum NOT NULL,
    transaction_id character varying,
    gateway_response json,
    processed_at timestamp without time zone,
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: service_packages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_packages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL,
    price numeric(10,2) NOT NULL,
    features json NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.service_packages OWNER TO postgres;

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    client_id uuid NOT NULL,
    service_package_id uuid,
    amount numeric(10,2) NOT NULL,
    frequency text DEFAULT 'MONTHLY'::text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    start_date timestamp with time zone DEFAULT now() NOT NULL,
    next_billing_date timestamp with time zone NOT NULL,
    description text NOT NULL,
    total_billed numeric(10,2) DEFAULT 0,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT subscriptions_frequency_check CHECK ((frequency = ANY (ARRAY['MONTHLY'::text, 'QUARTERLY'::text, 'YEARLY'::text]))),
    CONSTRAINT subscriptions_status_check CHECK ((status = ANY (ARRAY['ACTIVE'::text, 'PAUSED'::text, 'CANCELLED'::text])))
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    full_name character varying NOT NULL,
    role public.users_role_enum DEFAULT 'CLIENT'::public.users_role_enum NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    company_name character varying,
    address json,
    communication_details json
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: payments PK_197ab7af18c93fbb0c9b28b4a59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY (id);


--
-- Name: audit_logs PK_1bb179d048bbc581caa3b013439; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY (id);


--
-- Name: invoices PK_668cef7c22a427fd822cc1be3ce; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: service_packages PK_d602a30f23af1a0ecf7c8e994df; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_packages
    ADD CONSTRAINT "PK_d602a30f23af1a0ecf7c8e994df" PRIMARY KEY (id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: invoices UQ_d8f8d3788694e1b3f96c42c36fb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "UQ_d8f8d3788694e1b3f96c42c36fb" UNIQUE (invoice_number);


--
-- Name: agent_sales agent_sales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_sales
    ADD CONSTRAINT agent_sales_pkey PRIMARY KEY (id);


--
-- Name: agent_sales agent_sales_sale_reference_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_sales
    ADD CONSTRAINT agent_sales_sale_reference_key UNIQUE (sale_reference);


--
-- Name: agents agents_agent_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_agent_code_key UNIQUE (agent_code);


--
-- Name: agents agents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_pkey PRIMARY KEY (id);


--
-- Name: agents agents_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_user_id_key UNIQUE (user_id);


--
-- Name: closers closers_closer_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.closers
    ADD CONSTRAINT closers_closer_code_key UNIQUE (closer_code);


--
-- Name: closers closers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.closers
    ADD CONSTRAINT closers_pkey PRIMARY KEY (id);


--
-- Name: payment_links payment_links_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_links
    ADD CONSTRAINT payment_links_pkey PRIMARY KEY (id);


--
-- Name: payment_links payment_links_secure_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_links
    ADD CONSTRAINT payment_links_secure_token_key UNIQUE (secure_token);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: idx_agent_sales_agent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agent_sales_agent_id ON public.agent_sales USING btree (agent_id);


--
-- Name: idx_agent_sales_client_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agent_sales_client_id ON public.agent_sales USING btree (client_id);


--
-- Name: idx_agent_sales_closer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agent_sales_closer_id ON public.agent_sales USING btree (closer_id);


--
-- Name: idx_agent_sales_commission_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agent_sales_commission_status ON public.agent_sales USING btree (commission_status);


--
-- Name: idx_agent_sales_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agent_sales_created_at ON public.agent_sales USING btree (created_at);


--
-- Name: idx_agent_sales_original_sale_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agent_sales_original_sale_id ON public.agent_sales USING btree (original_sale_id);


--
-- Name: idx_agent_sales_sale_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agent_sales_sale_date ON public.agent_sales USING btree (sale_date);


--
-- Name: idx_agent_sales_sale_reference; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agent_sales_sale_reference ON public.agent_sales USING btree (sale_reference);


--
-- Name: idx_agent_sales_sale_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agent_sales_sale_status ON public.agent_sales USING btree (sale_status);


--
-- Name: idx_agents_agent_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agents_agent_code ON public.agents USING btree (agent_code);


--
-- Name: idx_agents_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agents_is_active ON public.agents USING btree (is_active);


--
-- Name: idx_agents_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agents_user_id ON public.agents USING btree (user_id);


--
-- Name: idx_closers_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_closers_code ON public.closers USING btree (closer_code);


--
-- Name: idx_closers_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_closers_status ON public.closers USING btree (status);


--
-- Name: idx_payment_links_client_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_links_client_id ON public.payment_links USING btree (client_id);


--
-- Name: idx_payment_links_expires_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_links_expires_at ON public.payment_links USING btree (expires_at);


--
-- Name: idx_payment_links_secure_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_links_secure_token ON public.payment_links USING btree (secure_token);


--
-- Name: idx_payment_links_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_links_status ON public.payment_links USING btree (status);


--
-- Name: idx_subscriptions_client_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscriptions_client_id ON public.subscriptions USING btree (client_id);


--
-- Name: idx_subscriptions_next_billing_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscriptions_next_billing_date ON public.subscriptions USING btree (next_billing_date);


--
-- Name: idx_subscriptions_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscriptions_status ON public.subscriptions USING btree (status);


--
-- Name: agent_sales trigger_update_agent_stats; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_agent_stats AFTER UPDATE ON public.agent_sales FOR EACH ROW EXECUTE FUNCTION public.update_agent_stats();


--
-- Name: subscriptions update_subscription_billing_date; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_subscription_billing_date BEFORE INSERT OR UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_next_billing_date();


--
-- Name: payments FK_427785468fb7d2733f59e7d7d39; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_427785468fb7d2733f59e7d7d39" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: invoices FK_5534ba11e10f1a9953cbdaabf16; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "FK_5534ba11e10f1a9953cbdaabf16" FOREIGN KEY (client_id) REFERENCES public.users(id);


--
-- Name: payments FK_563a5e248518c623eebd987d43e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "FK_563a5e248518c623eebd987d43e" FOREIGN KEY (invoice_id) REFERENCES public.invoices(id);


--
-- Name: audit_logs FK_bd2726fd31b35443f2245b93ba0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: invoices FK_c36c3f595c8210d8b69121ec808; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "FK_c36c3f595c8210d8b69121ec808" FOREIGN KEY (service_package_id) REFERENCES public.service_packages(id);


--
-- Name: agent_sales agent_sales_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_sales
    ADD CONSTRAINT agent_sales_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE CASCADE;


--
-- Name: agent_sales agent_sales_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_sales
    ADD CONSTRAINT agent_sales_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: agent_sales agent_sales_closer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_sales
    ADD CONSTRAINT agent_sales_closer_id_fkey FOREIGN KEY (closer_id) REFERENCES public.closers(id) ON DELETE SET NULL;


--
-- Name: agent_sales agent_sales_original_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_sales
    ADD CONSTRAINT agent_sales_original_sale_id_fkey FOREIGN KEY (original_sale_id) REFERENCES public.agent_sales(id);


--
-- Name: agents agents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payment_links payment_links_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_links
    ADD CONSTRAINT payment_links_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payment_links payment_links_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_links
    ADD CONSTRAINT payment_links_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id);


--
-- Name: subscriptions subscriptions_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_service_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_service_package_id_fkey FOREIGN KEY (service_package_id) REFERENCES public.service_packages(id);


--
-- Name: payment_links Users can read own payment links; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can read own payment links" ON public.payment_links FOR SELECT USING (((client_id = (current_setting('app.current_user_id'::text))::uuid) OR (current_setting('app.current_user_role'::text) = 'ADMIN'::text)));


--
-- Name: subscriptions Users can read own subscriptions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can read own subscriptions" ON public.subscriptions FOR SELECT USING (((client_id = (current_setting('app.current_user_id'::text))::uuid) OR (current_setting('app.current_user_role'::text) = 'ADMIN'::text)));


--
-- Name: agent_sales; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.agent_sales ENABLE ROW LEVEL SECURITY;

--
-- Name: agents; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

--
-- Name: payment_links; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;

--
-- Name: subscriptions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA public TO app_user;


--
-- Name: TABLE agent_sales; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.agent_sales TO app_user;


--
-- Name: TABLE agents; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.agents TO app_user;


--
-- Name: TABLE audit_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.audit_logs TO app_user;


--
-- Name: TABLE closers; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.closers TO app_user;


--
-- Name: TABLE invoices; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.invoices TO app_user;


--
-- Name: TABLE migrations; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.migrations TO app_user;


--
-- Name: SEQUENCE migrations_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.migrations_id_seq TO app_user;


--
-- Name: TABLE payment_links; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.payment_links TO app_user;


--
-- Name: TABLE payments; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.payments TO app_user;


--
-- Name: TABLE service_packages; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.service_packages TO app_user;


--
-- Name: TABLE subscriptions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.subscriptions TO app_user;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.users TO app_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO app_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES TO app_user;


--
-- PostgreSQL database dump complete
--

