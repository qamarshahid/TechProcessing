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
-- Data for Name: agent_sales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agent_sales (id, agent_id, client_id, sale_reference, client_name, client_email, client_phone, service_name, service_description, sale_amount, agent_commission_rate, closer_commission_rate, agent_commission, closer_commission, total_commission, sale_status, commission_status, sale_date, payment_date, commission_paid_date, notes, client_details, metadata, created_at, updated_at, closer_name, original_sale_id, changes_made, resubmission_count, closer_id) FROM stdin;
f21d6697-7b6d-4e83-a5d0-68c15ffff208	ef838f79-3a55-4790-a676-86288b3fdd6e	\N	SALE-1756075795198-431EWMG3U	zyx	qamar@gmail.com	0903233493	seo	skdnad	99.00	6.00	10.00	5.94	9.90	15.84	APPROVED	APPROVED	2025-08-24	2025-08-23	\N	hello	\N	\N	2025-08-24 18:49:55.198964-04	2025-08-24 19:05:48.617208-04	John Agent	\N	\N	0	\N
493c556b-ff4c-428b-946f-a27083809931	ef838f79-3a55-4790-a676-86288b3fdd6e	\N	SALE-1756077303953-U1UNM4KTE	foo	uooo@gmail.com	2392392	seo	\N	99.00	6.00	10.00	5.94	9.90	15.84	REJECTED	PENDING	2025-08-25	2025-08-09	\N	REJECTION FEEDBACK: wtf is this??	\N	\N	2025-08-24 19:15:03.955158-04	2025-08-24 19:16:25.944677-04	hd	\N	\N	0	\N
b4f4d5db-3f33-487b-8b6b-326590bd5825	ef838f79-3a55-4790-a676-86288b3fdd6e	\N	SALE-1756078094343-RGV84D563	foo	uooo@gmail.com	239239200	seo	\N	99.00	6.00	10.00	5.94	9.90	15.84	APPROVED	APPROVED	2025-08-24	2025-08-08	\N	sorry	\N	\N	2025-08-24 19:28:14.343848-04	2025-08-24 19:28:49.753793-04	hd	493c556b-ff4c-428b-946f-a27083809931	{"clientPhone": {"to": "239239200", "from": "2392392"}, "serviceDescription": {"from": null}}	1	\N
e86409ce-f726-495a-b34a-2e9453d0d38b	ef838f79-3a55-4790-a676-86288b3fdd6e	\N	SALE-1756078720334-1SGJ8R560	dsd	d@gmail.com	ddd	seo	\N	19.98	6.00	10.00	1.20	2.00	3.20	REJECTED	PENDING	2025-08-03	2025-08-03	\N	REJECTION FEEDBACK: noo	\N	\N	2025-08-24 19:38:40.33606-04	2025-08-24 19:39:01.070535-04	hn	\N	\N	0	\N
d7d15f96-6a89-46aa-b158-53807867e5c0	ef838f79-3a55-4790-a676-86288b3fdd6e	\N	SALE-1756078770748-W7NO508GT	dsd	d@gmail.com	090078601	seo	\N	19.98	6.00	10.00	1.20	2.00	3.20	APPROVED	APPROVED	2025-08-02	2025-08-02	\N	\N	\N	\N	2025-08-24 19:39:30.748419-04	2025-08-24 19:48:41.105455-04	hn	e86409ce-f726-495a-b34a-2e9453d0d38b	{"clientPhone": {"to": "090078601", "from": "ddd"}, "serviceDescription": {"from": null}}	1	\N
49b0b7f5-172f-416f-8629-71e437be62ac	ef838f79-3a55-4790-a676-86288b3fdd6e	\N	SALE-1756088134076-I5HGB3P3U	nnn	d@gmail.com	001111	seo	\N	99.00	6.00	10.00	5.94	9.90	15.84	APPROVED	APPROVED	2025-08-24	\N	\N	\N	\N	\N	2025-08-24 22:15:34.07646-04	2025-08-24 22:15:51.311022-04	Hannad	\N	\N	0	e9d079c9-f185-4fac-875f-743b36bb9c34
\.


--
-- Data for Name: agents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agents (id, user_id, agent_code, sales_person_name, closer_name, agent_commission_rate, closer_commission_rate, total_earnings, total_paid_out, pending_commission, total_sales, total_sales_value, is_active, metadata, created_at, updated_at) FROM stdin;
ef838f79-3a55-4790-a676-86288b3fdd6e	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	AG001	John Agent	John Agent	6.00	10.00	19.02	0.00	19.02	4	316.98	t	\N	2025-08-24 18:11:51.119569-04	2025-08-24 22:15:51.314384-04
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, action, entity_type, entity_id, details, ip_address, user_agent, user_id, created_at) FROM stdin;
511d0328-a5ec-4d08-94cd-2db728aee54b	USER_CREATED	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"email":"test@example.com","role":"CLIENT"}	\N	\N	\N	2025-07-17 18:25:48.35039
e7fe88f9-c95a-4828-b42f-8f9ee848e379	USER_CREATED	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com","role":"ADMIN"}	\N	\N	\N	2025-07-17 18:52:37.551805
6a5749f8-6d61-404d-addc-7d091b820816	USER_REGISTERED	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com","role":"ADMIN"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 18:52:37.554038
911e407b-00af-4e22-8a02-17fd31e6e8ad	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 18:52:58.750724
c087abc7-28d3-48a4-868d-98108414955e	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 18:53:12.257226
2e54fb14-8633-4a25-8271-0c905e91b1a5	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 18:53:54.977376
82b1cc35-d7b4-4cd5-9fb4-f6bb23799889	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 18:56:06.568435
383f900b-919d-4beb-bdc8-b806320afe1b	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 19:02:00.118079
a15b626c-dad2-4a0b-9180-cf6413fe131b	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 19:39:30.257154
9f74c4f9-d041-435c-8312-4baadea4ecc0	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 19:46:58.111555
eb7245f0-ddf5-4c75-9f67-1dcbc8c9c6e6	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 19:50:39.860472
b9b865d2-6406-4fe9-90d9-8f5dab1be0cd	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 20:01:41.440952
9d536235-8c1f-4cf5-9a38-ad52ae74ba0c	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 20:14:47.802533
86d41cd6-a1bf-4cae-b9eb-e8c44863a3cb	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 20:23:13.188057
bf9df271-c823-47e8-a31d-b865bd0f1bba	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 20:35:31.45358
f9c68e64-702f-4226-a154-cb5886fa5a06	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 20:36:04.926367
b195d75d-d5ec-4b1a-8827-fada00633b5f	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 20:59:49.430794
1a6b0519-0eac-4691-9a8e-35fc03616f7b	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 21:22:45.746832
f3281c3c-98de-4c66-bf05-1947d0e62e3f	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 21:28:50.087129
ba349410-cf38-454d-a586-72d4e2712b3c	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 21:30:17.364785
53e717e9-3145-4713-a7b4-1b050aa5617e	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 21:31:50.202056
f425d3ba-318d-457c-9de0-b8ae8ba153c6	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 21:42:44.028614
d7212046-b93a-455d-9853-08d506e20bd3	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 22:05:21.185622
101de90c-8f15-4d66-8eec-c0f6c5a462ac	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 22:07:02.561595
63d8948f-73d4-47b8-aebc-e3f13820ff66	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 22:12:32.575042
5f290302-d448-4816-bb51-647b0e54d071	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 22:34:12.414293
bd19bf5d-e70b-486e-83a5-84f283a20ab3	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:01:30.224231
b6ea8c0d-68ca-4252-8226-b4332833ae0a	USER_CREATED	User	d31bed5e-cb79-4ece-9d18-88bc262d4623	{"email":"qamar1@example.com","role":"ADMIN"}	\N	\N	\N	2025-07-17 23:05:05.715901
2482a318-dfe5-4df2-bb62-ced769dc15e0	USER_REGISTERED	User	d31bed5e-cb79-4ece-9d18-88bc262d4623	{"email":"qamar1@example.com","role":"ADMIN"}	\N	\N	d31bed5e-cb79-4ece-9d18-88bc262d4623	2025-07-17 23:05:05.71798
13503e16-e2c2-4b6e-b00c-05d0f5d8a3ac	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:09:30.314272
b0bd1742-0046-4c20-87b1-94d210c3efa1	USER_CREATED	User	6d3debfe-94c1-4408-a9aa-a5ad0ede0c18	{"email":"hello@example.com","role":"CLIENT"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:10:24.308808
cd3f00b9-05cf-410e-b0ac-7e2fd6ab0ce7	USER_DELETED	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"email":"test@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:10:38.596621
bf5a300d-6edd-4081-8a31-2bc3c7e6e26f	USER_CREATED	User	58d5552f-4d58-4f4f-9896-434adece6a8f	{"email":"ali@ali.com","role":"CLIENT"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:11:05.974222
2cf692d2-30b1-4641-bb55-82417edc5314	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:22:32.55602
9fa94df6-1146-4eb7-a65f-eca1ceef514e	INVOICE_CREATED	Invoice	8b54001d-a40a-48b6-8374-b763efc7d085	{"invoiceNumber":"INV-2025-0001","amount":90}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:22:49.102951
9d46b925-af00-416f-962c-e1e9d3127aea	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:23:25.511164
9c6d6cf1-c061-43f0-8282-04d865cc05e5	SERVICE_PACKAGE_CREATED	ServicePackage	09311f1f-5a3d-430d-a7e2-ab43305c36d0	{"name":"seo","price":99}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:24:29.83376
1455e745-0b1b-4de3-b568-14fec519b9a1	SERVICE_PACKAGE_DELETED	ServicePackage	09311f1f-5a3d-430d-a7e2-ab43305c36d0	{"name":"seo"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:28:04.585807
ccaada5e-9ab7-43f1-9d49-9da60e57f7a1	SERVICE_PACKAGE_DELETED	ServicePackage	09311f1f-5a3d-430d-a7e2-ab43305c36d0	{"name":"seo"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:28:06.511783
162cd0c9-aa85-4344-98b4-1983ad587f67	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:34:44.578651
b28cde6f-0892-48a8-b9fb-541d80e46991	SERVICE_PACKAGE_CREATED	ServicePackage	007c9199-5265-4ac3-809f-974df77522bd	{"name":"seo","price":90}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:35:12.307172
a392df45-ff1c-4c03-be61-49a7f209378a	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:39:38.72577
2689ba64-e45d-40c7-8628-d03c5734686e	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:41:49.502939
c7af4bf7-a1db-438f-b22f-6b3b9ca40638	USER_LOGIN	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"email":"test@example.com"}	\N	\N	\N	2025-07-17 18:47:23.9757
00820ea2-d11b-4868-8bd3-2d5e59afbda4	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:42:44.662912
5bbd16eb-aff3-4eb5-ac35-298a86e4b13b	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:43:54.546016
35e30c1d-7540-48a1-9b86-994632ffe61b	INVOICE_CREATED	Invoice	d79b3964-5709-4cec-b1cb-b81acef39a47	{"invoiceNumber":"INV-2025-0001","amount":90}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:44:06.362897
9a2b8248-8042-49d1-b23c-4a6851fb460c	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:45:20.897343
1e86d6cf-7750-4bf8-9bd5-0f79e3a88049	INVOICE_CREATED	Invoice	7947fd10-7180-4f66-aac1-11574ed23513	{"invoiceNumber":"INV-2025-0001","amount":90}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:46:19.289304
f1fc5980-db19-4d83-8aa0-53ae9cc72725	INVOICE_CREATED	Invoice	4b355b22-13d0-4182-8f92-d8cc0e9015eb	{"invoiceNumber":"INV-2025-0002","amount":66}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:46:32.58543
f248f18e-ec91-48dc-8696-277e9de7b758	USER_DELETED	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"email":"test@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:55:31.288854
8654f676-fa07-4223-a10a-828410295942	USER_DELETED	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"email":"test@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-17 23:55:34.114849
c1374fec-8b93-498e-b9df-665e558fc33c	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:10:33.921866
9b9a691c-6c98-44c2-bd84-4705ac8c14c8	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:15:30.094464
e52750b6-b13d-423e-939f-644d4285141f	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:16:10.915346
ba54c063-7e5b-4585-852d-b1b3db1827ee	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:16:32.001384
e7781625-cbbc-4a11-879e-817ab37bf1a4	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:17:22.452061
06143206-61b2-403c-93f7-8a9481149de9	USER_CREATED	User	1ef8b01f-3578-41ca-a0ba-dd449ac86d90	{"email":"jane@example.cook","role":"CLIENT"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:17:46.485166
72eb4d8c-c775-47e7-a814-afef0ed1d529	USER_CREATED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com","role":"CLIENT"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:18:13.111343
189dc5d8-4f0a-4243-99ee-e583b74813da	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:21:14.513086
4e129361-8150-4404-ae9b-81e7e82044e8	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:21:29.055778
9b0d0583-f073-4e22-b11c-f3eb8c8e2bd4	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:22:05.308332
25199548-6012-4340-885a-8b772bc49bb9	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:23:50.922345
ef0ab8bd-b46b-46f3-8bc2-cfc48d145231	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:24:43.785035
718cf854-3922-4cad-b14d-3c88f2d8f72e	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:24:46.380958
c06a8c20-d57c-4592-83d9-79d351dcab32	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:24:48.16579
5c6e1d74-2d4c-4d4f-bd5d-c65c72bbc536	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:25:04.429924
c117b63a-71db-462d-ad3a-34f356f54a78	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:25:09.591849
10f518ff-4407-4e44-8f35-8b208b1e27af	USER_CREATED	User	f42ebab5-46bd-46a0-88c3-1e3f277f0587	{"email":"testp@example.com","role":"CLIENT"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:25:38.771341
e9f5eb7e-f744-4092-9ae6-00c8d75fc1b1	SERVICE_PACKAGE_CREATED	ServicePackage	2cad2d19-b298-4047-9a10-64af9e718f5a	{"name":"po","price":99}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:26:02.895178
a3099ddb-3d64-46da-82d4-554d05e84baf	USER_CREATED	User	11c6714e-6a83-4add-b39c-0e11ea4a45a4	{"email":"admin9@techservepro.com","role":"CLIENT"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-07-18 00:28:11.763078
5b317d87-aa76-4228-be00-72c4f39750a6	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:25:55.635095
6d2219d1-73b3-466e-aa04-d22f78b7baad	SERVICE_PACKAGE_CREATED	ServicePackage	91985561-d722-43e9-94a0-2a107cfda921	{"name":"qamartest","price":90.99}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:27:24.573231
67e5c4d3-405d-4f3c-81c9-50dab7aae877	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:28:00.154579
0d78ad95-cc44-4cf3-9f3e-9124bc917cc0	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:28:02.495804
04c95bdd-8e87-4379-9c78-a77bb17a51a9	USER_CREATED	User	42c6268c-5210-4bb4-a2f1-7b4ba28c76e5	{"email":"qamar@newtest.com","role":"CLIENT"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:30:35.567289
b74838ef-4078-4ae2-aa51-e92cf740ab48	USER_LOGIN	User	42c6268c-5210-4bb4-a2f1-7b4ba28c76e5	{"email":"qamar@newtest.com"}	\N	\N	42c6268c-5210-4bb4-a2f1-7b4ba28c76e5	2025-08-02 17:31:40.98885
4967198f-37d5-4039-a856-8e0ad49ec440	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:40:34.673928
04564696-5251-41c4-8390-067cc7ac7fa8	USER_LOGIN	User	42c6268c-5210-4bb4-a2f1-7b4ba28c76e5	{"email":"qamar@newtest.com"}	\N	\N	42c6268c-5210-4bb4-a2f1-7b4ba28c76e5	2025-08-02 17:49:33.425003
6900bf48-4e82-4feb-9ca2-e076c7979c9e	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:50:19.044232
5d2577c4-da0e-4e1e-af48-20cc7aa15f47	USER_DELETED	User	f42ebab5-46bd-46a0-88c3-1e3f277f0587	{"email":"testp@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:55:50.713121
798516ba-a9f4-4f53-84b0-b45b096b3b3e	USER_DELETED	User	11c6714e-6a83-4add-b39c-0e11ea4a45a4	{"email":"admin9@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:55:52.79526
bff9e406-10a8-47f9-82ae-fbb2d572c722	USER_DELETED	User	42c6268c-5210-4bb4-a2f1-7b4ba28c76e5	{"email":"qamar@newtest.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:55:55.613242
c5bdd63a-329b-4ab7-9784-bded24134362	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:55:57.469839
a062d5ad-a58b-47ba-bf45-7c9fbec49fda	USER_DELETED	User	1ef8b01f-3578-41ca-a0ba-dd449ac86d90	{"email":"jane@example.cook"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:55:59.548481
9a6433fb-271f-4cf8-a7f1-db53cbdc9830	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:56:01.513518
c92a1594-5a2d-4e88-a451-c3829eb8f5e0	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:56:03.235048
e752b1a9-b229-42eb-b29c-c3b2c687f6c8	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:56:04.82075
1cf197f2-17b0-468c-8657-02b1cd6f42ec	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:56:06.810923
ee0bc503-db3c-4d05-864a-96a4166b1ba2	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:56:10.627487
2dcaa3ef-ebd3-457b-885e-52c0828c1e0f	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:56:13.178384
7c164419-2150-431f-8e92-9dcaed518c9d	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:56:16.468348
12316126-69ec-4448-a0f4-c0dcb8c60b0d	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:56:18.405772
85a069d8-bbec-46d4-99a6-a6f2d4b5ab3e	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:56:20.452059
81df4f7f-526e-4c49-bb59-e4fec07ae1be	USER_DELETED	User	58d5552f-4d58-4f4f-9896-434adece6a8f	{"email":"ali@ali.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:56:23.358152
078c04b7-d3ae-4bde-b67b-00a10c331f28	USER_DELETED	User	6d3debfe-94c1-4408-a9aa-a5ad0ede0c18	{"email":"hello@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:56:25.167857
cc3f17b4-cad8-4f94-b38f-8ababe272ba0	USER_DELETED	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"email":"test@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:56:26.797405
4c88b5a5-177e-4e95-a919-636d93ea15ed	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 17:59:59.507969
034113d1-f9cb-4771-8a0c-37443d7e31be	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:00:14.946625
1f4812f8-f9a0-4f92-80e7-d2550b33b165	USER_DELETED	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"email":"test@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:00:23.275465
72392c95-7254-4004-9a4e-d52a7edb90d7	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:01:00.087685
ab8c0cb8-5579-43ed-a1b7-1caeb8353b74	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:04:38.235617
7be835e6-4172-49dd-b271-423a43de9c76	USER_DELETED	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"email":"test@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:04:50.831068
91256c8a-06fb-4cc9-9b4d-7a19d168def2	USER_CREATED	User	afb50092-5969-48c3-b954-76be701077a9	{"email":"ahmad@test.com","role":"CLIENT"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:05:11.102795
7b90f6f3-a1dd-4b59-a68b-8421479d81f2	USER_DELETED	User	afb50092-5969-48c3-b954-76be701077a9	{"email":"ahmad@test.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:05:24.404949
0d1972ba-b359-4c86-b711-53c8202b38a2	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:05:32.915199
3d761925-229d-4f3a-b93f-859febb7d2c1	USER_DELETED	User	afb50092-5969-48c3-b954-76be701077a9	{"email":"ahmad@test.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:05:41.751447
9300a1e7-420c-42fd-aa1a-ac7e8694d7b1	USER_DELETED	User	afb50092-5969-48c3-b954-76be701077a9	{"email":"ahmad@test.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:05:44.464567
71d28257-5f61-491d-ba3b-a953dbf1ddbb	USER_DELETED	User	afb50092-5969-48c3-b954-76be701077a9	{"email":"ahmad@test.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:05:54.565666
3f342e22-1a67-4ded-a603-33700eb71c7c	SERVICE_PACKAGE_DELETED	ServicePackage	91985561-d722-43e9-94a0-2a107cfda921	{"name":"qamartest"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:15:02.414449
b08483d0-8bd6-4e72-b3f7-9f9373f95bb8	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:20:59.518192
605655ae-37eb-4fbc-888d-b3220764088b	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:21:10.840728
0e37d12b-601e-4521-b341-740498fc60bd	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:21:26.12916
206173aa-e1d2-4691-bd25-933b5362363b	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:21:34.366123
e31eaea1-a5b2-491b-8150-87e5eeac08f8	USER_UPDATED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"role":"CLIENT","fullName":"Qamar Shahid","email":"admin@techservepro.com","companyName":"","communicationDetails":[{"type":"EMAIL","subType":"WORK","detail":"admin@techservepro.com"}]}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:21:48.237688
771974b3-9f69-496c-8c05-010f13857684	USER_DELETED	User	afb50092-5969-48c3-b954-76be701077a9	{"email":"ahmad@test.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:22:42.647141
94f86d3b-f0f7-41d1-8aff-39b76e6ba4f7	USER_DELETED	User	afb50092-5969-48c3-b954-76be701077a9	{"email":"ahmad@test.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:22:47.031524
8f5a22b7-cd31-4b49-96c3-15eab3b96c6f	USER_DELETED	User	afb50092-5969-48c3-b954-76be701077a9	{"email":"ahmad@test.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:22:50.01221
65564ef5-b78c-496a-99fb-64089ec55bf9	USER_DELETED	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"email":"test@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:27:04.356237
f6ac04d0-4576-472f-9172-dfa8b1881794	USER_DELETED	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"email":"test@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:27:34.38321
1d9892cc-db06-4a7a-ba7c-6d009403bf08	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:29:49.431349
89a303c0-d3db-49ac-9f97-41b5c6c64aa2	USER_DELETED	User	afb50092-5969-48c3-b954-76be701077a9	{"email":"ahmad@test.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:30:00.994456
85f40902-bcb3-4554-8ccd-60a0342f46ef	USER_DELETED	User	afb50092-5969-48c3-b954-76be701077a9	{"email":"ahmad@test.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:34:13.243796
722b5e8b-e564-4a21-8b1a-29c1538f7233	USER_DELETED	User	6e0d25c1-a0b7-43e9-8511-bdb5ac58980e	{"email":"admin@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:34:16.854155
10018634-fea2-4d21-bb7d-ee6f172656c5	USER_UPDATED	User	6d3debfe-94c1-4408-a9aa-a5ad0ede0c18	{"role":"CLIENT","fullName":"Jane Smith","email":"hello@example.com","companyName":"","communicationDetails":[{"type":"EMAIL","subType":"WORK","detail":"hello@example.com"}]}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:34:26.74754
640fbbf8-9f07-4d95-b356-bd4a68a67918	USER_UPDATED	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"role":"CLIENT","isActive":true}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:36:12.579271
28850018-ee3a-4452-9319-0e7d3250b920	USER_UPDATED	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"role":"CLIENT","isActive":false}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:37:27.473731
cd4d44cf-b2ad-48f2-a769-d48b0ef49b5c	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:48:33.938168
2296d645-18c5-46df-98f8-05eb731d2414	INVOICE_CREATED	Invoice	d0003a41-5fff-4d10-804c-71135dff4a0a	{"invoiceNumber":"INV-2025-0001","amount":99}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:52:07.210172
a199c2e1-116c-4c9f-90df-5b1d06c9c664	USER_UPDATED	User	42c6268c-5210-4bb4-a2f1-7b4ba28c76e5	{"role":"CLIENT","isActive":true}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:52:38.692047
2988c585-3367-4874-ad06-805908d34d98	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:54:14.735705
71dc9bfc-2ef7-4c30-a65c-0680740501a4	USER_UPDATED	User	f42ebab5-46bd-46a0-88c3-1e3f277f0587	{"role":"CLIENT","isActive":true}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:54:24.230538
a3b5a85e-91fd-4731-b9d1-d0536bad1725	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:54:47.417108
54d6badf-14d4-4ef7-877f-f4eb43e9ddb9	USER_UPDATED	User	42c6268c-5210-4bb4-a2f1-7b4ba28c76e5	{"role":"CLIENT","isActive":true}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:54:51.968728
3e9f33d7-712a-48f4-a5f3-eb999ad941a0	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:55:56.686676
8acece81-7feb-40c1-9062-9890b8bf0fef	USER_CREATED	User	5d6ce508-06ce-46d6-8af5-cd0dc3898656	{"email":"ahmad1@test.com","role":"CLIENT"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:56:18.401736
b33d8418-3066-4847-9c36-a644027d5525	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:57:19.796943
09ac8fc5-ba6e-4597-af90-80dab1ddd3a9	USER_UPDATED	User	42c6268c-5210-4bb4-a2f1-7b4ba28c76e5	{"role":"CLIENT","isActive":true}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:57:40.438497
57ef6d59-53ff-4427-8259-a308bc47ff5e	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:57:48.762409
0480d3fa-280f-494f-9ed2-49113a0b46ae	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 18:59:53.991771
75525f75-72bc-4094-b0f6-554458cc2a96	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:00:58.697059
c70baf3f-297b-4663-b648-9e39812521d6	USER_UPDATED	User	42c6268c-5210-4bb4-a2f1-7b4ba28c76e5	{"role":"CLIENT","isActive":true}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:01:14.038296
fce5311b-81db-4a87-be4a-c4dca1224ded	USER_UPDATED	User	42c6268c-5210-4bb4-a2f1-7b4ba28c76e5	{"role":"CLIENT","isActive":false}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:01:16.7296
99d180ac-8251-4c03-94cf-3f1fc08e4601	USER_UPDATED	User	f42ebab5-46bd-46a0-88c3-1e3f277f0587	{"role":"CLIENT","isActive":true}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:01:18.705271
871759a6-6aea-4b92-bce6-dabde1d57c5d	USER_UPDATED	User	f42ebab5-46bd-46a0-88c3-1e3f277f0587	{"role":"CLIENT","isActive":false}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:01:27.669028
d72a4731-4b06-4fd8-ac75-5e76644317c4	USER_REGISTERED	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"email":"test@example.com","role":"CLIENT"}	\N	\N	\N	2025-07-17 18:25:48.353511
e24e29cd-47af-437c-a97e-8dc9c7c01f4c	USER_LOGIN	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"email":"test@example.com"}	\N	\N	\N	2025-07-17 18:47:39.13228
d4d92759-c166-4e22-a835-8c418d2c2eb9	USER_LOGIN	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"email":"test@example.com"}	\N	\N	\N	2025-07-17 18:47:59.306686
f69d2b4d-57d6-43c2-9fa5-a79174fbda4b	USER_LOGIN	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"email":"test@example.com"}	\N	\N	\N	2025-07-17 20:17:32.624932
b80c4133-5602-440d-a99c-07737963b239	USER_DELETED	User	99977344-7629-40d4-9e34-1c5c43d30f78	{"email":"test@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:03:05.334422
e5e3ed25-8fc1-4518-8eee-06920bbd3251	USER_DELETED	User	58d5552f-4d58-4f4f-9896-434adece6a8f	{"email":"ali@ali.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:03:09.864303
553efb37-d330-4a73-8e46-30823d9442e3	USER_DELETED	User	6d3debfe-94c1-4408-a9aa-a5ad0ede0c18	{"email":"hello@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:03:14.394477
82635cfd-08c9-4b29-8f61-9864f964f3b6	USER_DELETED	User	11c6714e-6a83-4add-b39c-0e11ea4a45a4	{"email":"admin9@techservepro.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:03:22.286213
4952c12f-1683-40ed-ad2d-2d7a8e70bde5	USER_DELETED	User	1ef8b01f-3578-41ca-a0ba-dd449ac86d90	{"email":"jane@example.cook"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:03:24.622507
50bb9b4f-6db5-460b-b0ce-6d95d9deb3c1	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:09:48.646269
dd696000-3831-4a61-822a-7974d14dd280	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:17:50.728123
c11d1698-42cc-4cd0-8e1a-ffd82ad7e847	INVOICE_CREATED	Invoice	1a7b76a6-6678-44ad-a9c7-5fcd918a97ce	{"invoiceNumber":"INV-2025-0001","amount":100}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:18:28.858882
ae398646-2fa5-4708-9592-0f72f6871322	INVOICE_CREATED	Invoice	3b20c472-6d88-4e57-ab60-f1545eeb7e3e	{"invoiceNumber":"INV-2025-0002","amount":10}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:20:45.924948
6ae11648-f8bb-41cb-ad7a-664e4090906b	INVOICE_CREATED	Invoice	af0c0634-5179-4394-86bb-50097f237a59	{"invoiceNumber":"INV-2025-0001","amount":90}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:22:55.103434
d8c0f733-c108-400e-b7af-beaf89edd906	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:27:29.806133
53a780c7-9f8d-443b-bcf5-f03ba8268719	INVOICE_CREATED	Invoice	cd68915d-e3da-4e48-9f1c-1219773c909b	{"invoiceNumber":"INV-2025-0001","amount":99.87}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:27:56.64834
63f21aca-de29-4bb0-bddd-35ea4b6058ac	INVOICE_CREATED	Invoice	e9799fcc-b910-438d-97ae-8242ce14246a	{"invoiceNumber":"INV-2025-0002","amount":99}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:29:41.468294
52bd80f6-89b3-4f0e-a792-d97642cfb876	INVOICE_STATUS_CHANGED	Invoice	e9799fcc-b910-438d-97ae-8242ce14246a	{"oldStatus":"DRAFT","newStatus":"PAID"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:29:49.222693
12e20e4f-ef89-4284-9d76-7b0d6df15aa8	INVOICE_UPDATED	Invoice	e9799fcc-b910-438d-97ae-8242ce14246a	{"description":"ssds","amount":99}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:29:56.757013
bce28be9-be9e-4f76-a5c1-eb26dd7841e6	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:37:28.540011
9032e08b-2d67-4790-bb4a-f2f35817bdc4	INVOICE_CREATED	Invoice	b2b7ae05-e504-429d-9b30-3bd06dae27da	{"invoiceNumber":"INV-2025-0003","amount":77}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:38:00.775962
4d67969f-ebb3-4d5b-9c4d-4220c75ece33	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:42:43.084182
32f0210a-454d-419a-a029-479b835613fb	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:48:08.221211
f2e1eacf-fa10-4de7-8fe2-340ab022081a	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:51:05.465793
073043d4-cfb2-427d-aae1-f140e20bab20	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 19:52:50.457103
478ea35a-9e2e-43ee-824a-5e8ce1cdc6e5	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 20:01:15.979513
09aab5c3-6079-4b10-b11c-f0a24d389c21	INVOICE_CREATED	Invoice	cbd656e1-119e-4e64-b930-760ec85dfc79	{"invoiceNumber":"INV-2025-0003","amount":99}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 20:01:54.201065
2bc56241-b68a-4174-a4dc-4aa3f55838f8	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 20:30:45.525312
ab4db246-4c8d-419b-ae50-4eea8f15656c	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 20:35:51.290044
9d4ba197-a9fe-4106-a3e5-a917a27ff9a8	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 20:39:04.884277
fe8acc44-e06e-4b34-b4ea-8a1686e55a40	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 20:44:23.553962
3624b5d8-095c-41fc-b49e-9fa7545c5d3a	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 20:48:44.08665
02e629af-b87a-4be5-856e-b8296a02e065	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 20:49:39.295775
91c89d5e-8ca9-4672-b91c-c103fe2aab74	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 21:08:35.774425
b9c0a1c8-f32c-41aa-9817-b9e3842bb485	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 21:11:48.153174
a5df9477-d84a-46d8-a15a-86b27f7345a5	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 21:15:28.810048
694125c2-ba46-4106-8b46-3e94c510e7c4	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 21:21:00.748575
8c367ece-2b76-4919-8e1f-727e5933113e	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 21:27:06.073609
baea7215-e277-411c-88af-20470370e913	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-02 22:02:52.320717
abcb95fb-3dfe-492b-a9d6-d80cf0e18717	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 12:07:20.748436
3af51a9b-5ccf-49cd-a545-2e24685290f7	INVOICE_CREATED	Invoice	e3d69ca3-d7f3-4892-94c5-4a9891f232c2	{"invoiceNumber":"INV-2025-0001","amount":99.99}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 12:19:57.048507
33008c8d-9260-4821-a58b-230b7c784fbc	INVOICE_STATUS_CHANGED	Invoice	e3d69ca3-d7f3-4892-94c5-4a9891f232c2	{"oldStatus":"DRAFT","newStatus":"PAID"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 12:20:03.68869
da2231fe-e4bc-4847-a23a-b2235a0c2c8f	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 12:21:16.066106
0c3338e2-c5cf-427b-b7ea-05e1d868a88c	INVOICE_STATUS_CHANGED	Invoice	e3d69ca3-d7f3-4892-94c5-4a9891f232c2	{"oldStatus":"PAID","newStatus":"CANCELLED"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 12:22:22.367419
2dce0bf3-c4cc-4e02-ba51-ceadb5f00020	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 13:55:35.886203
75628c11-d60a-48d0-a094-87b4180851fc	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 13:56:07.593679
a278a915-dbe2-4092-812c-1feeb8dfca45	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 13:56:44.939018
511dbc92-a676-4551-83cc-7a7fdc9b1824	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 14:00:04.936021
f3a97198-2d30-498a-9565-f92a117b9721	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 14:08:16.20664
8d943e33-5bdc-4203-aa96-b3fb3c49262c	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 14:08:29.117127
554a1afc-047a-4c1a-95fc-1038794f106b	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 14:09:18.040066
35c6acb8-3f44-4ab8-b01c-f6ca56113fb1	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 14:10:08.916802
a79a8e45-d5d0-4845-98f3-b9a4b08998e3	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 14:16:17.754969
7897c364-958e-411b-bcfe-088c29ff5c46	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 14:18:25.506069
a8b10480-b266-4a88-957e-06d3a95856ee	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 14:25:15.863883
9cf1c9c5-b1fe-46eb-a6dc-f726e1867565	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 14:36:16.986807
563ad89c-8862-4943-a065-a23a1886e5ab	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 14:36:38.713693
fd2ba2e2-54b4-4b21-a3a1-30d91787e87e	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 14:37:54.153311
6b4df41b-b737-4d97-925b-bb038690a94f	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 14:58:09.509982
2b3edcbf-391a-459a-85ac-859342c659e3	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 16:56:02.548443
9696adf0-b1aa-4d32-890e-adef0d4a0abd	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 18:29:19.793323
57ba3169-7856-4e2c-980b-4e0b2bdb96c8	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 18:33:28.4318
fdcdd993-0a9f-4bdf-bb6e-b199b28bea21	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 18:34:21.863349
22c037f1-37c4-4131-979d-357366a60692	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 18:58:53.810828
59ab98c5-e374-46b0-a9ac-792e6951809b	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:09:04.957283
965f95a0-9d67-442c-96c3-81d6d85abda0	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:11:00.96091
dfe52966-674d-4c2c-b14b-be24b13be41f	SUBSCRIPTION_STATUS_CHANGED	Subscription	e8355306-d41a-4221-96f5-69200d6fa532	{"oldStatus":"ACTIVE","newStatus":"PAUSED"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:11:07.75574
26aa8607-9a39-4f2c-b4cb-1edbd6221018	SUBSCRIPTION_STATUS_CHANGED	Subscription	e8355306-d41a-4221-96f5-69200d6fa532	{"oldStatus":"PAUSED","newStatus":"ACTIVE"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:11:13.324489
89587fa3-a312-46d4-a0a4-3ccf3082090a	SUBSCRIPTION_CANCELLED	Subscription	e8355306-d41a-4221-96f5-69200d6fa532	{"clientId":"f42ebab5-46bd-46a0-88c3-1e3f277f0587"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:11:24.266023
6ee43a27-5958-4b9c-bea4-89da465f4b0d	SUBSCRIPTION_CANCELLED	Subscription	e8355306-d41a-4221-96f5-69200d6fa532	{"clientId":"f42ebab5-46bd-46a0-88c3-1e3f277f0587"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:11:28.696229
d0b8d0e0-fc75-4100-907f-5238718c0871	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:17:55.724715
620007ee-7fab-4104-b337-b1b4bbc243f1	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:18:20.984945
957c8037-808b-44cf-9c7c-36273fb3e297	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:23:27.728784
c8e9552d-6d08-41c7-8fe1-1e44b81d357d	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:23:33.201293
7948211d-147d-42bb-9a81-226e72127124	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:30:12.47961
f7787a41-964c-4cc6-adaf-e14b0935be8f	SUBSCRIPTION_UPDATED	Subscription	72800f9a-914a-48a8-b779-3ea7699f65ea	{"amount":29,"frequency":"MONTHLY","description":"Monthly seo for ahmadtest","metadata":{"notes":""}}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:31:15.029948
fe4bdbfc-aa3b-4b08-82f2-299f92f18c9d	SUBSCRIPTION_CANCELLED	Subscription	e8355306-d41a-4221-96f5-69200d6fa532	{"clientId":"f42ebab5-46bd-46a0-88c3-1e3f277f0587"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:31:21.145409
7d036b29-968a-4dbb-841c-c2907d3f98dd	SUBSCRIPTION_CANCELLED	Subscription	805747ce-7582-4119-a16a-c4ba0ee3b0b5	{"clientId":"42c6268c-5210-4bb4-a2f1-7b4ba28c76e5"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:31:32.65769
6a4c81e2-7084-4fa0-84e2-610b2128763b	SUBSCRIPTION_CANCELLED	Subscription	72800f9a-914a-48a8-b779-3ea7699f65ea	{"clientId":"5d6ce508-06ce-46d6-8af5-cd0dc3898656"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:31:43.304008
07c2fae1-84d8-4404-a55b-4a8a587a895a	SUBSCRIPTION_STATUS_CHANGED	Subscription	805747ce-7582-4119-a16a-c4ba0ee3b0b5	{"oldStatus":"CANCELLED","newStatus":"ACTIVE"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:32:43.89849
07389eea-153b-4e5e-a07c-d2816e6f6b1b	SUBSCRIPTION_STATUS_CHANGED	Subscription	72800f9a-914a-48a8-b779-3ea7699f65ea	{"oldStatus":"CANCELLED","newStatus":"ACTIVE"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:32:45.51929
be7af3ee-87ab-4b58-a29b-47c501fb391c	SUBSCRIPTION_STATUS_CHANGED	Subscription	805747ce-7582-4119-a16a-c4ba0ee3b0b5	{"oldStatus":"ACTIVE","newStatus":"PAUSED"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:32:47.787972
6a7a09b5-aecb-4ffd-9df7-f6af875fa898	SUBSCRIPTION_UPDATED	Subscription	72800f9a-914a-48a8-b779-3ea7699f65ea	{"amount":29.01,"frequency":"MONTHLY","description":"Monthly seo for ahmadtest","metadata":{"notes":""}}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:32:53.823929
73fd3a68-1dca-4003-b080-2a9e93b2ea53	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:40:48.253619
e89500de-46d4-4da6-9b57-ed8599545007	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:47:56.406395
b7565dda-7813-415e-a452-7ae9aecba22f	USER_CREDENTIALS_UPDATED	User	5d6ce508-06ce-46d6-8af5-cd0dc3898656	{"emailChanged":true,"passwordChanged":true,"sendEmail":true}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:49:33.315819
eed4264b-bfc0-4c4b-a9cd-21a8f56a5d82	USER_LOGIN	User	5d6ce508-06ce-46d6-8af5-cd0dc3898656	{"email":"ahmad1@test.com"}	\N	\N	5d6ce508-06ce-46d6-8af5-cd0dc3898656	2025-08-03 19:49:50.170273
81b24d90-aa56-4538-b15a-5ab25b89155a	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:53:07.859109
519d8ea9-ddbf-49c3-8da1-e10b8da4b1c7	INVOICE_CREATED	Invoice	20b49c99-07c3-4c4e-8f1e-9a708f55a79a	{"invoiceNumber":"INV-2025-0001","amount":100}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:53:24.01574
48cb9c99-7ce0-4bb9-a4c4-4d78fe9b6bc3	USER_LOGIN	User	5d6ce508-06ce-46d6-8af5-cd0dc3898656	{"email":"ahmad1@test.com"}	\N	\N	5d6ce508-06ce-46d6-8af5-cd0dc3898656	2025-08-03 19:53:41.960968
97795303-ba2a-4dda-816a-07452d0af718	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 19:54:42.234604
2a6132f3-18af-4246-96d6-e5baee7afa24	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 23:29:24.213823
c2447d8f-1167-4a04-bd37-454d2a989b09	INVOICE_STATUS_CHANGED	Invoice	20b49c99-07c3-4c4e-8f1e-9a708f55a79a	{"oldStatus":"DRAFT","newStatus":"PAID"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 23:47:08.147704
e1af6ca6-ccb5-404c-b826-9aa15da6c66e	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 23:48:01.966677
70ddb212-d383-4853-90af-f2f72352d8e7	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-03 23:56:01.837653
601d3bc9-6efc-412e-97a3-ae5dde5e8982	INVOICE_CREATED	Invoice	e5b89927-b3ee-481a-99cf-e33d8f9b6e70	{"invoiceNumber":"INV-2025-0002","amount":88}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-04 00:03:50.427167
584aa966-a010-49a2-ad01-a76b52b87352	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-07 19:37:02.752835
744bb00e-d1af-485f-8068-307937ffaf8e	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-07 19:42:46.18367
18cfd0bc-7def-4517-8dcb-b958fc145719	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-08 11:41:50.490484
74f18b18-f0c4-409e-9fba-6d55be018c49	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-08 17:12:59.882289
9155590d-146a-43a2-935b-4c60f8657a96	INVOICE_STATUS_CHANGED	Invoice	20b49c99-07c3-4c4e-8f1e-9a708f55a79a	{"oldStatus":"PAID","newStatus":"CANCELLED"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-08 17:13:32.193257
e5c41eae-827f-4f1f-a8db-c483cf44ce97	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:09:19.399449
b7dbe511-17e9-49fb-9ebb-d1ceaf4bb9ff	SUBSCRIPTION_CREATED	Subscription	c772e83c-d324-415d-968f-1d614ae8833d	{"clientId":"42c6268c-5210-4bb4-a2f1-7b4ba28c76e5","amount":99,"frequency":"MONTHLY"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:10:07.931569
6fc7c4d4-d1a2-4f60-aa60-29f56027e434	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:10:16.161554
654d70f9-169a-4421-8acb-e8a2db9834dd	SUBSCRIPTION_CREATED	Subscription	ec00981d-723b-4f55-9db8-3f654803fbaf	{"clientId":"42c6268c-5210-4bb4-a2f1-7b4ba28c76e5","amount":90,"frequency":"MONTHLY"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:10:33.545057
cad097df-ce88-406b-a5fc-a07c35669d5b	SUBSCRIPTION_CREATED	Subscription	4d7ba6fb-514c-48ad-8d05-3a621e5e31ec	{"clientId":"5d6ce508-06ce-46d6-8af5-cd0dc3898656","amount":99,"frequency":"MONTHLY"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:11:19.052457
171d6504-514c-436e-a43f-592b2b2b4315	SUBSCRIPTION_CREATED	Subscription	036a2da3-ffe2-4831-a005-a082dda6dab9	{"clientId":"5d6ce508-06ce-46d6-8af5-cd0dc3898656","amount":90,"frequency":"MONTHLY"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:11:33.836123
067bf014-ad51-4f43-968b-bf1b6d5f9160	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:14:53.772071
79a39428-d668-4d2b-8471-60e095d25d86	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:15:02.057379
b582b229-6b18-4de6-8b20-04aeb3f2dff3	SUBSCRIPTION_CANCELLED	Subscription	805747ce-7582-4119-a16a-c4ba0ee3b0b5	{"clientId":"42c6268c-5210-4bb4-a2f1-7b4ba28c76e5"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:15:12.028958
984ca518-bb4a-4ebd-bcff-10860ccbd543	SUBSCRIPTION_CANCELLED	Subscription	72800f9a-914a-48a8-b779-3ea7699f65ea	{"clientId":"5d6ce508-06ce-46d6-8af5-cd0dc3898656"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:15:17.026366
ffee42dd-31c2-49bc-a8af-07acd960c526	SUBSCRIPTION_CANCELLED	Subscription	4d7ba6fb-514c-48ad-8d05-3a621e5e31ec	{"clientId":"5d6ce508-06ce-46d6-8af5-cd0dc3898656"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:15:23.240691
2a97ae34-6b11-4ad4-845e-2f06e42cc691	SUBSCRIPTION_CANCELLED	Subscription	036a2da3-ffe2-4831-a005-a082dda6dab9	{"clientId":"5d6ce508-06ce-46d6-8af5-cd0dc3898656"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:15:25.080656
99074f10-a72f-4800-8177-9536d8f887ec	SUBSCRIPTION_CANCELLED	Subscription	036a2da3-ffe2-4831-a005-a082dda6dab9	{"clientId":"5d6ce508-06ce-46d6-8af5-cd0dc3898656"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:15:28.146833
26688c5f-8a2e-4480-81a3-0faa38f3c650	SUBSCRIPTION_CANCELLED	Subscription	805747ce-7582-4119-a16a-c4ba0ee3b0b5	{"clientId":"42c6268c-5210-4bb4-a2f1-7b4ba28c76e5"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:15:31.380848
18ae99be-e801-40a7-9155-77133792f955	SUBSCRIPTION_CANCELLED	Subscription	ec00981d-723b-4f55-9db8-3f654803fbaf	{"clientId":"42c6268c-5210-4bb4-a2f1-7b4ba28c76e5"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:15:33.841758
b82187bf-94b3-4ed4-9c18-39903057c72a	SUBSCRIPTION_CANCELLED	Subscription	c772e83c-d324-415d-968f-1d614ae8833d	{"clientId":"42c6268c-5210-4bb4-a2f1-7b4ba28c76e5"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:15:35.856486
aec9e84d-1195-458d-99a2-c7b3e4ae33d3	SUBSCRIPTION_CREATED	Subscription	4afabd45-5df7-4887-ba8d-89e5eb24c127	{"clientId":"5d6ce508-06ce-46d6-8af5-cd0dc3898656","amount":99,"frequency":"MONTHLY"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:16:17.808917
93d2a1e5-dbda-4d4c-a645-8263743c900f	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:22:19.297409
6777fa91-4baa-4980-a672-114dba802d11	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:22:30.343477
e0ca26a7-4301-445e-bf53-80ba888d8ea1	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:26:19.648013
d0c2c16b-b4db-4656-887c-9880ace8597d	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:34:17.701984
67e0cb12-c872-4483-9fed-f4f8f5d8d5da	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:34:25.7549
213d4816-45af-4ad4-83cb-58727d43110b	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:40:55.406803
f7fbcf57-960f-48f8-b83f-cf90092feb61	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:48:51.237195
6453fe0b-774a-4acf-8228-d1a1489c956c	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 16:49:34.996393
7d02544b-ad29-4d4a-92a0-794d192a8e81	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 17:17:42.051059
9ac4942e-445d-4542-acb9-f1ce0797315c	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 17:23:49.378052
5afd2b0d-8d8b-4bbe-a296-7f9f057ae999	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 17:24:01.375178
a689a510-645b-4098-af73-5cbcb2c5a631	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 17:27:56.813759
9adbed16-f81e-4627-932b-e94e1f338ad9	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 17:32:36.676351
f8310c7b-41a9-4cfc-b06c-6950592a21e1	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 17:37:01.503194
f3939fc7-4001-44f7-bb94-2009d96bec60	PAYMENT_LINK_CREATED	PaymentLink	4c3b9c5c-987c-4c4b-835e-2ed05d591b89	{"clientId":"5d6ce508-06ce-46d6-8af5-cd0dc3898656","amount":250,"title":"xox"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 17:37:13.192515
31dc02cc-5a05-4f20-8bd4-de7adfbaa02b	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 17:39:30.894357
fd3c9edc-deda-47ef-8efd-a620d2e66097	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 17:53:27.102117
276114d3-73c7-41ee-8500-97768a51c404	PAYMENT_LINK_PAYMENT_COMPLETED	PaymentLink	4c3b9c5c-987c-4c4b-835e-2ed05d591b89	{"transactionId":"TXN_1756072420678_je7mch32d","amount":"250.00"}	\N	\N	5d6ce508-06ce-46d6-8af5-cd0dc3898656	2025-08-24 17:53:40.683129
326be742-7395-494d-bb4e-d00da2c0ce08	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 17:54:05.666677
fc08e37b-5142-44ba-a5ee-074bb805d2d1	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 18:18:13.154816
ac593b6f-cf0d-43c4-99c4-373c74aa29fc	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 18:20:52.653858
eae47c7d-b6c8-4691-8747-a889cb98a314	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 18:23:06.974369
f5241385-8ab8-4157-b8d1-d161fdc15a88	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 18:26:52.305175
2c5de7d2-f1ee-48db-a04f-40227c5d5be9	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 18:31:30.058663
73374e72-4494-41f0-8c6c-d5691439e87e	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 18:49:18.037613
73bbb9b1-df4d-4946-af7d-2a6db37ad1cd	AGENT_SALE_CREATED	AgentSale	f21d6697-7b6d-4e83-a5d0-68c15ffff208	{"saleReference":"SALE-1756075795198-431EWMG3U","saleAmount":99,"totalCommission":15.84,"clientName":"zyx"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 18:49:55.204149
b69a55e5-93ff-4eb1-99e6-437d1bb126ac	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 18:50:52.236165
094ea56c-08f6-4707-9c2b-75486f7e4611	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 18:54:21.625063
2891bc4f-e21a-4110-acc6-685a3bae8199	AGENT_SALE_STATUS_UPDATED	AgentSale	f21d6697-7b6d-4e83-a5d0-68c15ffff208	{"oldStatus":"APPROVED","newStatus":"APPROVED"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 18:54:30.372034
9cf2ce50-4f11-475a-888b-f12cf39e01bb	AGENT_COMMISSION_STATUS_UPDATED	AgentSale	f21d6697-7b6d-4e83-a5d0-68c15ffff208	{"oldStatus":"APPROVED","newStatus":"APPROVED"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 18:54:32.664158
3ea80a19-906d-4c3e-9681-7625becdab3b	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 18:55:17.615181
ddf8c221-488e-488f-ad27-2b41c696504b	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 18:58:35.948333
bacbf602-f8d3-4627-92fb-7ee6ed3d6d9b	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 19:01:35.531977
725f61b4-7723-460a-bfa7-fe5d2fcd9f86	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:01:59.03106
baf57dee-0e0d-4fb9-ac4a-d1f5bb387ac8	AGENT_SALE_NOTES_UPDATED	AgentSale	f21d6697-7b6d-4e83-a5d0-68c15ffff208	{"notes":"no"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:02:49.158639
c1e78486-843c-4d52-96d0-98f54f6cdca6	AGENT_SALE_NOTES_UPDATED	AgentSale	f21d6697-7b6d-4e83-a5d0-68c15ffff208	{"notes":"Nooo"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:02:54.753988
ed5e9e87-d5e3-46ef-8727-2e365eebe9ea	AGENT_SALE_NOTES_UPDATED	AgentSale	f21d6697-7b6d-4e83-a5d0-68c15ffff208	{"notes":"nnnn"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:03:09.134254
8b01e964-0642-4fa3-83a6-fee4a7976d1a	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:05:26.440776
ddecbdce-09ca-440e-854e-3064800844c6	AGENT_SALE_NOTES_UPDATED	AgentSale	f21d6697-7b6d-4e83-a5d0-68c15ffff208	{"notes":"hello"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:05:48.622501
3af0c59e-c8a0-4c2d-8076-75fde2581055	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 19:06:08.423737
f56e30d1-342b-45d6-af4b-cebebe326c1b	AGENT_SALE_CREATED	AgentSale	493c556b-ff4c-428b-946f-a27083809931	{"saleReference":"SALE-1756077303953-U1UNM4KTE","saleAmount":99,"totalCommission":15.84,"clientName":"foo"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 19:15:03.964039
1b6549d7-3aa0-4e84-9481-c6b03744bc47	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:15:44.584039
0dc85eca-2f0c-4b16-a4dc-2bd5d65be887	AGENT_SALE_STATUS_UPDATED	AgentSale	493c556b-ff4c-428b-946f-a27083809931	{"oldStatus":"REJECTED","newStatus":"REJECTED"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:16:25.934299
44819c65-ac51-4718-95de-1ca57f5ae225	AGENT_SALE_NOTES_UPDATED	AgentSale	493c556b-ff4c-428b-946f-a27083809931	{"notes":"REJECTION FEEDBACK: wtf is this??"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:16:25.945971
f6f76751-9ead-4d90-b066-e5a9c8d414cf	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 19:16:43.077924
0dcb8da1-bb1c-4dad-b61e-92c67ed0dd38	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:27:35.843758
1288f91a-dc48-40ee-9df2-78c7a0f9bfb6	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 19:27:59.585547
c3e8f605-4342-4516-882b-257691aebe5b	AGENT_SALE_RESUBMITTED	AgentSale	b4f4d5db-3f33-487b-8b6b-326590bd5825	{"originalSaleId":"493c556b-ff4c-428b-946f-a27083809931","changesMade":{"clientPhone":{"from":"2392392","to":"239239200"},"serviceDescription":{"from":null}},"resubmissionCount":1}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 19:28:14.349936
4c877474-a36f-4a12-9f8c-00252010019a	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:28:29.376934
71fd0dc3-5292-4ee1-80e3-fec75edc6b3b	AGENT_SALE_STATUS_UPDATED	AgentSale	b4f4d5db-3f33-487b-8b6b-326590bd5825	{"oldStatus":"APPROVED","newStatus":"APPROVED"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:28:47.872159
26144e13-2b65-4922-b32b-ba88a2b8451a	AGENT_COMMISSION_STATUS_UPDATED	AgentSale	b4f4d5db-3f33-487b-8b6b-326590bd5825	{"oldStatus":"APPROVED","newStatus":"APPROVED"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:28:49.757423
4ef65960-e991-48eb-9f73-3a433abe309c	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 19:29:50.911542
b6a5e686-d37d-47bc-9f1d-3d76ec889ac0	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:33:43.215054
d9519683-2e2a-467c-bd1b-90289f84df6e	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 19:35:29.16192
caafcef7-9b00-40b9-aba1-2e0ea96c71d5	AGENT_SALE_CREATED	AgentSale	e86409ce-f726-495a-b34a-2e9453d0d38b	{"saleReference":"SALE-1756078720334-1SGJ8R560","saleAmount":19.98,"totalCommission":3.1968,"clientName":"dsd"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 19:38:40.344534
8a4f018e-650b-43c9-b49a-0fb8541e92b8	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:38:54.065953
4bed4900-2a73-4a58-8b8b-c37a40754fb7	AGENT_SALE_STATUS_UPDATED	AgentSale	e86409ce-f726-495a-b34a-2e9453d0d38b	{"oldStatus":"REJECTED","newStatus":"REJECTED"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:39:01.055454
f4002dfe-397e-4d31-af89-cf612d43ada1	AGENT_SALE_NOTES_UPDATED	AgentSale	e86409ce-f726-495a-b34a-2e9453d0d38b	{"notes":"REJECTION FEEDBACK: noo"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:39:01.072264
25af2b90-38b3-4795-8156-f9524c6a5bf2	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 19:39:14.954864
d85b6077-e982-4805-a364-328b2e0050b2	AGENT_SALE_RESUBMITTED	AgentSale	d7d15f96-6a89-46aa-b158-53807867e5c0	{"originalSaleId":"e86409ce-f726-495a-b34a-2e9453d0d38b","changesMade":{"clientPhone":{"from":"ddd","to":"090078601"},"serviceDescription":{"from":null}},"resubmissionCount":1}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 19:39:30.754183
0bcaf9f4-cdaf-4b21-a9e8-53b011ea009c	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 19:40:35.498041
69aa0644-38c8-4106-af9f-11677aa144fb	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 19:45:26.759117
9b1b2cbc-1755-4a41-83ca-aa06a5f89b80	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 19:46:53.472362
cf03ce93-0ec9-426a-8500-740bdc7a5bc7	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:48:28.111408
8af83acd-9c24-44de-a08a-dcd05807cd95	AGENT_SALE_STATUS_UPDATED	AgentSale	d7d15f96-6a89-46aa-b158-53807867e5c0	{"oldStatus":"APPROVED","newStatus":"APPROVED"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:48:39.538502
e874cca7-643b-4446-bd17-0b3b31197140	AGENT_COMMISSION_STATUS_UPDATED	AgentSale	d7d15f96-6a89-46aa-b158-53807867e5c0	{"oldStatus":"APPROVED","newStatus":"APPROVED"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 19:48:41.109104
77eac659-d314-499d-bed8-7190ff41f053	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 20:03:21.501375
aeebf19d-5ff2-4b6a-a332-6dba8a264aec	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 20:05:59.611617
4fcc8f05-c8a2-45ca-98e7-3990e822bb76	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 21:22:43.555875
8434ba8b-652a-4155-be38-43af4e641f15	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 21:34:53.647099
5c3110ab-8680-4cda-b1c9-5d85d05f309e	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 21:37:58.932764
f7fd0e17-8a1f-4b1a-874d-52febe4c483d	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 21:45:13.851505
a09c316e-ab0a-4c6a-8fe0-b564906ca942	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 21:59:07.147361
e078f73a-3255-4faf-9c44-4636fb84328e	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:06:43.328786
8ea3ac97-79d2-4599-960b-33d184bf5bdd	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 22:08:17.082845
c3b17514-3f91-498d-9e1f-152417d02813	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:08:36.417338
875e8e3d-419d-4939-81b9-5cc9d754e2bd	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 22:10:46.220231
c1afaa67-0612-4a8f-8f9d-7d7d1e8a318e	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 22:11:40.746275
fecadbc6-a6b3-4b64-bb26-c1fd7a04f1f2	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:12:21.029216
873155b0-9ec4-4148-aafc-bc533a7f56a4	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 22:12:48.428827
101c1f70-d4b7-48d4-aee1-059702e0e273	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:13:00.845298
83a59bf1-9695-4509-bfb3-055f33aa39d9	USER_LOGIN	User	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	{"email":"agent1@techprocessing.com"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 22:15:10.020899
d2e27253-0539-4c10-aea6-da10ce094743	AGENT_SALE_CREATED	AgentSale	49b0b7f5-172f-416f-8629-71e437be62ac	{"saleReference":"SALE-1756088134076-I5HGB3P3U","saleAmount":99,"totalCommission":15.84,"clientName":"nnn"}	\N	\N	52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	2025-08-24 22:15:34.082728
a4c8444f-1a5e-40ed-b5ed-931b1b3496f3	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:15:41.8938
2fb4d4f7-729d-444d-8b82-ee5746585507	AGENT_SALE_STATUS_UPDATED	AgentSale	49b0b7f5-172f-416f-8629-71e437be62ac	{"oldStatus":"APPROVED","newStatus":"APPROVED"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:15:50.489933
c852cc0d-517c-4763-8f61-815dff2f17d1	AGENT_COMMISSION_STATUS_UPDATED	AgentSale	49b0b7f5-172f-416f-8629-71e437be62ac	{"oldStatus":"APPROVED","newStatus":"APPROVED"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:15:51.314959
504470e1-779e-446b-840b-e453295ce4fc	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:18:37.012742
af1cf707-6d03-4e3e-9f54-ffbbd0f2ad31	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:19:54.900857
9d8ff5bc-5110-4f5d-92df-ffe1acf15637	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:20:47.951899
18edbbc4-f2aa-488d-8d0c-d8f19e38a257	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:21:06.114253
5fbc99e9-d9bd-4616-ad19-66aa0ea12f23	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:24:29.133679
68c703ec-e5d7-423b-bb1d-50ec000861ee	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:24:43.080088
400b469d-936e-4c81-aa19-0fd25fd9e7e6	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:25:00.403185
6739cb6e-589c-4754-96dc-a3b687a7ef05	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:26:27.152602
2570d8b4-ad66-4802-bd1d-9c36bbd6f7d4	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:26:48.687815
245b0d6b-805e-45d4-99de-cdfd255976ff	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:29:01.984649
55c7918d-298b-4825-ab7f-6e9d2a965780	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:29:40.574927
ce85df0e-3db4-458d-91a8-dff3063a53c7	USER_LOGIN	User	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	{"email":"qamar@example.com"}	\N	\N	270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	2025-08-24 22:30:48.977081
\.


--
-- Data for Name: closers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.closers (id, closer_code, closer_name, commission_rate, status, email, phone, notes, created_at, updated_at) FROM stdin;
e9d079c9-f185-4fac-875f-743b36bb9c34	001	Hannad	10.00	ACTIVE	gg@gg.com			2025-08-24 22:14:55.804995-04	2025-08-24 22:14:55.804995-04
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, invoice_number, client_id, amount, tax, total, status, description, "lineItems", due_date, sent_date, paid_date, notes, created_at, updated_at, service_package_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
\.


--
-- Data for Name: payment_links; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_links (id, client_id, title, description, amount, secure_token, status, expires_at, allow_partial_payment, used_at, payment_id, metadata, created_at, updated_at) FROM stdin;
4c3b9c5c-987c-4c4b-835e-2ed05d591b89	5d6ce508-06ce-46d6-8af5-cd0dc3898656	xox		250.00	ZHrKfXDFS9N23niKmdV9gRVhvistrx3f	USED	2025-09-22 20:00:00-04	f	2025-08-24 17:53:40.678-04	\N	{"email": "test@example.com", "createdBy": "270eb0d3-a489-4d4c-9e1f-a19ee3133ee2", "sendEmail": true, "processedAt": "2025-08-24T21:53:40.678Z", "transactionId": "TXN_1756072420678_je7mch32d", "billingAddress": {"city": "Test City", "state": "TS", "address": "123 Test St", "country": "US", "zipCode": "12345", "lastName": "User", "firstName": "Test"}, "cardholderName": "Test User", "paymentProcessed": true}	2025-08-24 17:37:13.187974-04	2025-08-24 17:53:40.680772-04
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, invoice_id, user_id, amount, method, status, transaction_id, gateway_response, processed_at, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: service_packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_packages (id, name, description, price, features, is_active, created_at, updated_at) FROM stdin;
09311f1f-5a3d-430d-a7e2-ab43305c36d0	seo	m	99.00	["99"]	f	2025-07-17 23:24:29.82787	2025-07-17 23:28:04.582352
007c9199-5265-4ac3-809f-974df77522bd	seo	,	90.00	["ew"]	t	2025-07-17 23:35:12.301672	2025-07-17 23:35:12.301672
2cad2d19-b298-4047-9a10-64af9e718f5a	po	kk	99.00	["m"]	t	2025-07-18 00:26:02.888389	2025-07-18 00:26:02.888389
91985561-d722-43e9-94a0-2a107cfda921	qamartest	hey	90.99	["test"]	f	2025-08-02 17:27:24.564802	2025-08-02 18:15:02.411976
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (id, client_id, service_package_id, amount, frequency, status, start_date, next_billing_date, description, total_billed, metadata, created_at, updated_at) FROM stdin;
e8355306-d41a-4221-96f5-69200d6fa532	f42ebab5-46bd-46a0-88c3-1e3f277f0587	09311f1f-5a3d-430d-a7e2-ab43305c36d0	29.70	MONTHLY	CANCELLED	2025-06-03 14:31:49.656676-04	2025-07-03 14:31:49.656676-04	Monthly seo for Qamar Shahid	59.40	\N	2025-08-03 14:31:49.656676-04	2025-08-03 19:11:24.262499-04
805747ce-7582-4119-a16a-c4ba0ee3b0b5	42c6268c-5210-4bb4-a2f1-7b4ba28c76e5	09311f1f-5a3d-430d-a7e2-ab43305c36d0	29.70	MONTHLY	CANCELLED	2025-06-03 14:31:49.656676-04	2025-07-03 14:31:49.656676-04	Monthly seo for qamarTest1	59.40	\N	2025-08-03 14:31:49.656676-04	2025-08-24 16:15:12.023256-04
72800f9a-914a-48a8-b779-3ea7699f65ea	5d6ce508-06ce-46d6-8af5-cd0dc3898656	09311f1f-5a3d-430d-a7e2-ab43305c36d0	29.01	MONTHLY	CANCELLED	2025-06-03 14:31:49.656676-04	2025-07-03 14:31:49.656676-04	Monthly seo for ahmadtest	59.40	{"notes": ""}	2025-08-03 14:31:49.656676-04	2025-08-24 16:15:17.021737-04
4d7ba6fb-514c-48ad-8d05-3a621e5e31ec	5d6ce508-06ce-46d6-8af5-cd0dc3898656	\N	99.00	MONTHLY	CANCELLED	2025-08-24 00:00:00-04	2025-09-24 00:00:00-04	po - Recurring Service	0.00	\N	2025-08-24 16:11:19.044501-04	2025-08-24 16:15:23.238107-04
036a2da3-ffe2-4831-a005-a082dda6dab9	5d6ce508-06ce-46d6-8af5-cd0dc3898656	\N	90.00	MONTHLY	CANCELLED	2025-08-24 00:00:00-04	2025-09-24 00:00:00-04	seo - Recurring Service	0.00	\N	2025-08-24 16:11:33.82945-04	2025-08-24 16:15:28.144554-04
ec00981d-723b-4f55-9db8-3f654803fbaf	42c6268c-5210-4bb4-a2f1-7b4ba28c76e5	\N	90.00	MONTHLY	CANCELLED	2025-07-29 00:00:00-04	2025-08-29 00:00:00-04	seo - Recurring Service	0.00	\N	2025-08-24 16:10:33.537175-04	2025-08-24 16:15:33.839893-04
c772e83c-d324-415d-968f-1d614ae8833d	42c6268c-5210-4bb4-a2f1-7b4ba28c76e5	\N	99.00	MONTHLY	CANCELLED	2025-08-24 00:00:00-04	2025-09-24 00:00:00-04	po - Recurring Service	0.00	\N	2025-08-24 16:10:07.912156-04	2025-08-24 16:15:35.854503-04
4afabd45-5df7-4887-ba8d-89e5eb24c127	5d6ce508-06ce-46d6-8af5-cd0dc3898656	\N	99.00	MONTHLY	ACTIVE	2025-08-24 00:00:00-04	2025-09-24 00:00:00-04	po - Recurring Service	0.00	\N	2025-08-24 16:16:17.80231-04	2025-08-24 16:16:17.80231-04
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, full_name, role, is_active, last_login, created_at, updated_at, company_name, address, communication_details) FROM stdin;
5d6ce508-06ce-46d6-8af5-cd0dc3898656	ahmad1@test.com	$2a$12$UbxOCyX9qJpGnC8LPZCJJOQUqvwYXFOllSuDL78eGVxQMJPKkJgN2	ahmadtest	CLIENT	t	2025-08-03 19:53:41.957	2025-08-02 18:56:18.171088	2025-08-03 19:53:41.958422		\N	[{"type":"EMAIL","subType":"WORK","detail":"ahmad1@test.com"}]
75a1a3b6-ff5b-471a-94ec-6c7c952f7e0b	admin@techprocessing.com	$2a$12$Nn3gLqHkfi80duEhkOZRFOyv29uTYC2qyJXrhhGv0j1vH1EU4qGx2	System Administrator	ADMIN	t	\N	2025-08-24 16:34:02.795649	2025-08-24 16:34:02.795649	\N	\N	\N
52b8fee5-b6e3-4a4a-a0f0-f563a0cd304b	agent1@techprocessing.com	$2a$12$8FO8wXk8Bn8a1jftpklt4OfFQb6CKnPBmcTigC8EXwoyIexnwc2/2	John Agent	AGENT	t	2025-08-24 22:15:10.018	2025-08-24 18:11:51.119056	2025-08-24 22:15:10.018825	\N	\N	\N
42c6268c-5210-4bb4-a2f1-7b4ba28c76e5	qamar@newtest.com	$2a$12$OzHl2nedjatrG.TWTKo1V.kCRsFO1lr22FOzgipWMd58pPmT56vEa	qamarTest1	CLIENT	f	2025-08-02 17:49:33.421	2025-08-02 17:30:35.342727	2025-08-02 19:01:16.50774		{"street":"","city":"","state":"","postalCode":"","country":""}	[{"type":"EMAIL","subType":"WORK","detail":""},{"type":"PHONE","subType":"WORK","detail":""}]
f42ebab5-46bd-46a0-88c3-1e3f277f0587	testp@example.com	$2a$12$.X7uVP10RWLIWqr3O1ZkxeLWoSVUmJNTTQGhY50Wj9zvdEuop.sNy	Qamar Shahid	CLIENT	f	\N	2025-07-18 00:25:38.542106	2025-08-02 19:01:27.447913	\N	\N	\N
d31bed5e-cb79-4ece-9d18-88bc262d4623	qamar1@example.com	$2a$12$PRbj2l9rTIn0k9BTxUe5V.eKBBQOVNu3p2EKzjfr.NOlWv.T7oSuG	John Doe	ADMIN	t	\N	2025-07-17 23:05:05.48006	2025-07-17 23:05:05.48006	\N	\N	\N
9b7b666f-ce4b-4c45-af5b-236becba3e97	client@example.com	$2a$12$o//kFhKdHM3EqSyIOv5lD.YWK0vXrITy6BoQ7SQdq08viVNNXAnhW	John Doe	CLIENT	t	\N	2025-08-24 16:34:03.25835	2025-08-24 16:34:03.25835	\N	\N	\N
270eb0d3-a489-4d4c-9e1f-a19ee3133ee2	qamar@example.com	$2a$12$O/1LdINnfUQInUYryNv7Se1Yu1.GFfGFDVih4qgA4wv5pHx0UJgry	John Doe	ADMIN	t	2025-08-24 22:30:48.973	2025-07-17 18:52:37.314961	2025-08-24 22:30:48.97447	\N	\N	\N
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);


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

