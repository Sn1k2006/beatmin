export type THttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type THeaders = Record<string, string>;

class RestAPI {
  private readonly url: string;
  private token: string | null = null;
  private statusCode: number = 0;
  private instances: Record<string, object> = {};
  private authErrorHandler?: () => void;
  private headersHandler?: (headers: THeaders) => void;
  public debug: boolean = false;

  constructor(url: string, debug: boolean) {
    this.url = url;
    this.debug = debug;
  }

  public getUrl = (): string => {
    return this.url;
  };

  setAuthErrorHandler = (handler?: () => void) => {
    this.authErrorHandler = handler;
  };

  setHeadersHandler = (handler?: (headers: THeaders) => void) => {
    this.headersHandler = handler;
  };

  setToken = (token: string | null): this => {
    this.token = token;
    return this;
  };

  getToken = (): string | null => {
    return this.token;
  };

  getStatusCode = (): number => {
    return this.statusCode;
  };

  get = (
    endpoint: string,
    payload?: object | FormData,
    fields?: string[]
  ): Promise<any> => {
    return this.request("GET", endpoint, payload, fields);
  };

  post = (
    endpoint: string,
    payload?: object | FormData,
    fields?: string[]
  ): Promise<any> => {
    return this.request("POST", endpoint, payload, fields);
  };

  put = (
    endpoint: string,
    payload?: object | FormData,
    fields?: string[]
  ): Promise<any> => {
    return this.request("PUT", endpoint, payload, fields);
  };

  patch = (
    endpoint: string,
    payload?: object | FormData,
    fields?: string[]
  ): Promise<any> => {
    return this.request("PATCH", endpoint, payload, fields);
  };

  delete = (
    endpoint: string,
    payload?: object | FormData,
    fields?: string[]
  ): Promise<any> => {
    return this.request("DELETE", endpoint, payload, fields);
  };

  private request = (
    method: THttpMethod,
    endpoint: string,
    payload: object | FormData = {},
    fields: string[] = []
  ): Promise<unknown> => {
    // @ts-ignore
    return new Promise((resolve, reject) => {
      const processReject = (error: string, code: number) => {
        if (this.debug) console.error("Error", error);
        if (code === 401 && this.authErrorHandler) this.authErrorHandler();
        else reject(error);
      };

      const options: {
        method: string;
        headers: Record<string, string>;
        body?: FormData | string;
      } = {
        method: method.toUpperCase(),
        headers: {
          accept: "application/json",
        },
      };

      if (payload instanceof FormData) {
        payload.append("fields", fields.join(","));
        options.body = payload;
      } else {
        options.headers["content-type"] = "application/json";
        // @ts-ignore
        payload["fields"] = fields;
        if (payload && method !== "GET") options.body = JSON.stringify(payload);
      }

      if (this.token) {
        options.headers["authorization"] = "Bearer " + this.token;
      }

      this.statusCode = 0;

      if (payload && method === "GET") {
        endpoint += "?__payload=" + encodeURIComponent(JSON.stringify(payload));
      }

      if (this.debug)
        console.log(
          "Request",
          method,
          endpoint.split("?")[0],
          JSON.parse(JSON.stringify(payload))
        );

      if (this.headersHandler) {
        this.headersHandler(options.headers);
      }

      fetch(this.url + endpoint, options)
        .then((response) => {
          this.statusCode = response.status;
          response
            .json()
            .then((data) => {
              if (data.error) processReject(data.error, response.status);
              else {
                if (this.debug) console.info("Result", data.result);
                resolve(data.result);
              }
            })
            .catch((e) => processReject(e, -2));
        })
        .catch((e) => processReject(e, -1));
    });
  };

  /** Get Batches API */
  get Batches(): Batches {
    return (
      (this.instances["Batches"] as Batches) ??
      (this.instances["Batches"] = new Batches(this))
    );
  }

  /** Get Badges API */
  get Badges(): Badges {
    return (
      (this.instances["Badges"] as Badges) ??
      (this.instances["Badges"] = new Badges(this))
    );
  }

  /** Get Billing API */
  get Billing(): Billing {
    return (
      (this.instances["Billing"] as Billing) ??
      (this.instances["Billing"] = new Billing(this))
    );
  }

  /** Get Videos API */
  get Videos(): Videos {
    return (
      (this.instances["Videos"] as Videos) ??
      (this.instances["Videos"] = new Videos(this))
    );
  }

  /** Get Users API */
  get Users(): Users {
    return (
      (this.instances["Users"] as Users) ??
      (this.instances["Users"] = new Users(this))
    );
  }

  /** Get Assets API */
  get Assets(): Assets {
    return (
      (this.instances["Assets"] as Assets) ??
      (this.instances["Assets"] = new Assets(this))
    );
  }

  /** Get Main API */
  get Main(): Main {
    return (
      (this.instances["Main"] as Main) ??
      (this.instances["Main"] = new Main(this))
    );
  }

  /** Get Tasks API */
  get Tasks(): Tasks {
    return (
      (this.instances["Tasks"] as Tasks) ??
      (this.instances["Tasks"] = new Tasks(this))
    );
  }

  /** Get Tracks API */
  get Tracks(): Tracks {
    return (
      (this.instances["Tracks"] as Tracks) ??
      (this.instances["Tracks"] = new Tracks(this))
    );
  }

  /** Get Performers API */
  get Performers(): Performers {
    return (
      (this.instances["Performers"] as Performers) ??
      (this.instances["Performers"] = new Performers(this))
    );
  }

  /** Get Notifications API */
  get Notifications(): Notifications {
    return (
      (this.instances["Notifications"] as Notifications) ??
      (this.instances["Notifications"] = new Notifications(this))
    );
  }

  /** Get Applications API */
  get Applications(): Applications {
    return (
      (this.instances["Applications"] as Applications) ??
      (this.instances["Applications"] = new Applications(this))
    );
  }
}

export { RestAPI };

export type TDateTime = string;

export type TDateTimeZone = string;

export type TIdentifier = string | number;

export interface IAsset {
  id: string;
  name: string;
  mime: string;
  size: number;
  url: string;
}

export interface ITrack {
  id: number;
  title: string;
  artist: string;
  album: string | null;
  feat: string | null;
  version: string | null;
  authorLyrics?: string | null;
  authorMusic?: string;
  file?: IAsset;
  sample?: IAsset;
  cover: IAsset;
  performer?: IPerformer;
  batch?: IBatch | null;
  owner?: IUser | null;
  limit?: number | null;
  views?: number;
  genre?: EMusicGenre;
  mood?: EMusicMood;
  lyrics?: string | null;
  isrc?: string | null;
  duration?: number;
  isExcluded?: boolean;
  language?: ELanguage | null;
  status?: EReviewStatus;
  isPublished?: boolean;
  isPaid?: boolean;
  isMusic: boolean;
  rejectReason?: string | null;
  cost?: number;
  video?: IVideo | null;
}

export interface ITransaction {
  id: number;
  user?: IUser;
  type: ETransactionType;
  balanceBefore: number;
  amount: number;
  balanceAfter: number;
  comment: string | null;
  createdAt: TDateTime;
  extra?: Record<string, any>;
}

export interface IVideoProject {
  id: string;
  video: IVideo;
  audio: IAsset | null;
  layers: Record<string, any>[];
  frame: IAsset | null;
  duration: number;
  light: "color" | "frame" | null;
  lightColor: string | null;
  createdAt?: TDateTime;
  updatedAt?: TDateTime;
}

export interface IPerformer {
  id: number;
  user?: IUser;
  nationality?: ECountry;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  stageName: string;
  regAddress?: string;
  postAddress?: string;
  phoneNumber?: string;
  links?: string[];
  passport?: IPassport;
  passportScan?: IAsset | null;
  status: EReviewStatus;
  scheme?: EScheme | null;
  distributor?: EDistributor | null;
  rejectReason?: string | null;
  createdAt?: TDateTime;
  updatedAt?: TDateTime;
}

export interface IBatch {
  id: number;
  performer?: IPerformer;
  contractBlank?: IAsset | null;
  contractOne?: IAsset | null;
  contractTwo?: IAsset | null;
  tracks?: ITrack[];
  createdAt: TDateTime;
  tag: string;
}

export interface IPerformerApplication {
  id: number;
  name: string;
  email: string;
  contacts: string;
  links: string;
  questions: string | null;
  status: EReviewStatus;
  rejectReason: string | null;
  createdAt: TDateTime;
  updatedAt: TDateTime | null;
  samples: IAsset[];
  source: string | null;
  ip: string | null;
  country: ECountry | null;
  user?: IUser | null;
  service: EService;
}

export interface INotification {
  id: number;
  user?: IUser;
  icon: IAsset | null;
  message: string;
  isNew: boolean;
  createdAt: TDateTime;
  extra?: Record<string, any>;
}

export interface IVideo {
  id: number;
  title: string;
  description?: string;
  tags?: ITag[];
  video: IAsset;
  preview: IAsset;
  track?: ITrack;
  extra?: Record<string, any>;
  duration?: number;
  resolution?: string;
}

export interface ITag {
  id: number;
  title: string;
}

export interface IUser {
  id: number;
  status: EUserStatus;
  service: EService | null;
  email: string;
  role: EUserRole;
  password?: string;
  balance?: number;
  ref?: IUser | null;
  refTag?: string;
  source?: string | null;
  apiKey?: string | null;
  createdAt?: TDateTime;
  accessedAt?: TDateTime;
  locale?: string;
  ip?: string | null;
  country?: ECountry | null;
  userIdentifier?: string;
  roles?: [];
}

export interface IAdminBadges {
  reviewPerformerApplications: number;
  reviewPerformerProfiles: number;
  reviewPerformerTracks: number;
  tracksHasNoVideo: number;
  review: number;
}

export interface ICommonRejectRequest {
  reason: string;
}

export interface IInitPartialUploadRequest {
  chunkSize: number;
  fileSize: number;
  fileName: string;
  fileType?: string;
  extra?: boolean;
  resize?: number | null;
  lock?: boolean;
}

export interface IPartialUploadStatus {
  id: string;
  fileName?: string;
  fileType?: string;
  fileSize: number;
  chunkSize: number;
  uploaded: number;
  progress: number;
  asset: IAsset | null;
  request?: IInitPartialUploadRequest;
  isReady: boolean;
}

export interface IUploadRequest {
  upload: { name: string; data: string };
}

export interface IPartialChunkUploadRequest {
  id: string;
  chunk: string;
}

export interface ISignBatchContractRequest {
  documentId: string;
}

export interface IGetBatchesRequest {
  page?: number;
  limit?: number;
}

export interface IGenerateTrackCoverTask {
  request?: IGenerateTrackCoverRequest;
  cover: IAsset | null;
  messageClass?: string;
  id?: string;
  status?: ETaskStatus;
  progress?: number | null;
  createdAt?: TDateTime;
  updatedAt?: TDateTime;
  message?: string | null;
}

export interface IGenerateVideoTask {
  email: string | null;
  projectId: string;
  result: IAsset | null;
  messageClass?: string;
  id?: string;
  status?: ETaskStatus;
  progress?: number | null;
  createdAt?: TDateTime;
  updatedAt?: TDateTime;
  message?: string | null;
}

export interface IUpdateTaskRequest {
  email?: string;
}

export interface IAbstractTask {
  id: string;
  status: ETaskStatus;
  progress: number | null;
  message: string | null;
  createdAt: TDateTime;
  updatedAt: TDateTime;
  messageClass?: string;
}

export interface IGetTransactionsHistoryRequest {
  type?: ETransactionType;
  page?: number;
  limit?: number;
}

export interface IApproveTrackRequest {
  cost?: number;
  distributor?: EDistributor | null;
  scheme?: EScheme;
}

export interface IGenerateTrackCoverRequest {
  content: string;
  style?: "illustration" | "3d render" | "photography" | "photorealism";
  mood?: EMusicMood;
  genre?: EMusicGenre;
}

export interface IGetTracksRequest {
  query?: string;
  batchId?: number;
  performerId?: number;
  hasContentId?: boolean;
  hasOwner?: boolean;
  isPublished?: boolean;
  isPaid?: boolean;
  genre?: EMusicGenre | EMusicGenre[];
  language?: ELanguage | ELanguage[];
  status?: EReviewStatus;
  sort?: "id" | "views";
  order?: ESortOrder;
  page?: number;
  limit?: number;
}

export interface IAddTrackRequest {
  performerId: number;
  fileId: string;
  sampleId: string;
  coverId: string;
  title: string;
  artist: string;
  album?: string | null;
  genre?: EMusicGenre;
  mood?: EMusicMood;
  lyrics?: string | null;
  authorLyrics?: string | null;
  authorMusic: string;
  feat?: string | null;
  version?: string | null;
  language?: ELanguage | null;
  isMusic?: boolean;
}

export interface IUpdateTrackRequest {
  fileId?: string;
  sampleId?: string;
  coverId?: string;
  title?: string;
  artist?: string;
  album?: string | null;
  genre?: EMusicGenre;
  mood?: EMusicMood;
  lyrics?: string | null;
  authorLyrics?: string | null;
  authorMusic?: string;
  feat?: string | null;
  version?: string | null;
  language?: ELanguage | null;
  isMusic?: boolean;
}

export interface ICreateVideoRequest {
  title: string;
  description: string;
  trackId: number;
  videoAssetId: string;
  previewAssetId: string;
  tags: (number | string)[];
}

export interface IUpdateVideoProjectRequest {
  audioAssetId?: string | null;
  frameAssetId: string;
  layers: Record<string, any>[];
  duration: number;
  light?: "color" | "frame" | null;
  lightColor?: string | null;
}

export interface IUpdateVideoRequest {
  title?: string;
  description?: string;
  trackId?: number;
  videoAssetId?: string;
  previewAssetId?: string;
  tags?: (number | string)[];
}

export interface IGetVideosRequest {
  query?: string | null;
  tags?: (number | string)[];
  page?: number;
  limit?: number;
}

export interface IUpdatePerformerRequest {
  nationality?: ECountry;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  stageName?: string;
  regAddress?: string;
  postAddress?: string;
  passport?: IPassport;
  passportScanId?: string;
  phoneNumber?: string;
  links?: string[];
}

export interface ICreatePerformerRequest {
  nationality: ECountry;
  lastName: string;
  firstName: string;
  middleName: string;
  stageName: string;
  regAddress: string;
  postAddress: string;
  passport: IPassport;
  passportScanId: string;
  phoneNumber: string;
  links: string[];
}

export interface IGetPerformersListRequest {
  query?: string | null;
  status?: EReviewStatus | null;
  page?: number;
  limit?: number;
}

export interface IPassport {
  series: string;
  number: string;
  issuedBy: string;
  issuedAt: TDateTime;
}

export interface IPerformerApplicationSubmitRequest {
  name: string;
  email: string;
  contacts: string;
  links: string;
  questions?: string | null;
  samples: string[];
  service?: EService | null;
  source?: string | null;
}

export interface IApprovePerformerApplicationRequest {
  email?: string | null;
  password?: string | null;
}

export interface IGetPerformerApplicationsRequest {
  query?: string | null;
  status?: EReviewStatus | null;
  order?: ESortOrder | null;
  page?: number;
  limit?: number;
}

export interface IGetUsersListRequest {
  page?: number;
  limit?: number;
}

export interface IFinishPasswordResetRequest {
  token: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
  role?: EUserRole | null;
}

export interface IBeginPasswordResetRequest {
  email: string;
}

export enum ECurrency {
  AED = "AED",
  AFN = "AFN",
  ALL = "ALL",
  AMD = "AMD",
  ANG = "ANG",
  AOA = "AOA",
  ARS = "ARS",
  AUD = "AUD",
  AWG = "AWG",
  AZN = "AZN",
  BAM = "BAM",
  BBD = "BBD",
  BDT = "BDT",
  BGN = "BGN",
  BHD = "BHD",
  BIF = "BIF",
  BMD = "BMD",
  BND = "BND",
  BOB = "BOB",
  BRL = "BRL",
  BSD = "BSD",
  BTC = "BTC",
  BTN = "BTN",
  BWP = "BWP",
  BYN = "BYN",
  BZD = "BZD",
  CAD = "CAD",
  CDF = "CDF",
  CHF = "CHF",
  CLF = "CLF",
  CLP = "CLP",
  CNH = "CNH",
  CNY = "CNY",
  COP = "COP",
  CRC = "CRC",
  CUC = "CUC",
  CUP = "CUP",
  CVE = "CVE",
  CZK = "CZK",
  DJF = "DJF",
  DKK = "DKK",
  DOP = "DOP",
  DZD = "DZD",
  EGP = "EGP",
  ERN = "ERN",
  ETB = "ETB",
  EUR = "EUR",
  FJD = "FJD",
  FKP = "FKP",
  GBP = "GBP",
  GEL = "GEL",
  GGP = "GGP",
  GHS = "GHS",
  GIP = "GIP",
  GMD = "GMD",
  GNF = "GNF",
  GTQ = "GTQ",
  GYD = "GYD",
  HKD = "HKD",
  HNL = "HNL",
  HRK = "HRK",
  HTG = "HTG",
  HUF = "HUF",
  IDR = "IDR",
  ILS = "ILS",
  IMP = "IMP",
  INR = "INR",
  IQD = "IQD",
  IRR = "IRR",
  ISK = "ISK",
  JEP = "JEP",
  JMD = "JMD",
  JOD = "JOD",
  JPY = "JPY",
  KES = "KES",
  KGS = "KGS",
  KHR = "KHR",
  KMF = "KMF",
  KPW = "KPW",
  KRW = "KRW",
  KWD = "KWD",
  KYD = "KYD",
  KZT = "KZT",
  LAK = "LAK",
  LBP = "LBP",
  LKR = "LKR",
  LRD = "LRD",
  LSL = "LSL",
  LYD = "LYD",
  MAD = "MAD",
  MDL = "MDL",
  MGA = "MGA",
  MKD = "MKD",
  MMK = "MMK",
  MNT = "MNT",
  MOP = "MOP",
  MRU = "MRU",
  MUR = "MUR",
  MVR = "MVR",
  MWK = "MWK",
  MXN = "MXN",
  MYR = "MYR",
  MZN = "MZN",
  NAD = "NAD",
  NGN = "NGN",
  NIO = "NIO",
  NOK = "NOK",
  NPR = "NPR",
  NZD = "NZD",
  OMR = "OMR",
  PAB = "PAB",
  PEN = "PEN",
  PGK = "PGK",
  PHP = "PHP",
  PKR = "PKR",
  PLN = "PLN",
  PYG = "PYG",
  QAR = "QAR",
  RON = "RON",
  RSD = "RSD",
  RUB = "RUB",
  RWF = "RWF",
  SAR = "SAR",
  SBD = "SBD",
  SCR = "SCR",
  SDG = "SDG",
  SEK = "SEK",
  SGD = "SGD",
  SHP = "SHP",
  SLL = "SLL",
  SOS = "SOS",
  SRD = "SRD",
  SSP = "SSP",
  STD = "STD",
  STN = "STN",
  SVC = "SVC",
  SYP = "SYP",
  SZL = "SZL",
  THB = "THB",
  TJS = "TJS",
  TMT = "TMT",
  TND = "TND",
  TOP = "TOP",
  TRY = "TRY",
  TTD = "TTD",
  TWD = "TWD",
  TZS = "TZS",
  UAH = "UAH",
  UGX = "UGX",
  USD = "USD",
  UYU = "UYU",
  UZS = "UZS",
  VES = "VES",
  VND = "VND",
  VUV = "VUV",
  WST = "WST",
  XAF = "XAF",
  XAG = "XAG",
  XAU = "XAU",
  XCD = "XCD",
  XDR = "XDR",
  XOF = "XOF",
  XPD = "XPD",
  XPF = "XPF",
  XPT = "XPT",
  YER = "YER",
  ZAR = "ZAR",
  ZMW = "ZMW",
  ZWL = "ZWL",
}

export enum EMusicMood {
  Chill = "chill",
  Uplifting = "uplifting",
  Sad = "sad",
  Mysterious = "mysterious",
  Angry = "angry",
  Creepy = "creepy",
  Melancholic = "melancholic",
  Dreamy = "dreamy",
  Dark = "dark",
  Intense = "intense",
  Upbeat = "upbeat",
  Relaxing = "relaxing",
  Romantic = "romantic",
  Calm = "calm",
  Scary = "scary",
  Happy = "happy",
  Peaceful = "peaceful",
  Energetic = "energetic",
  Epic = "epic",
  Other = "other",
}

export enum ETaskStatus {
  Queued = "queued",
  Processing = "processing",
  Finished = "finished",
  Failed = "failed",
}

export enum EDistributor {
  FreshTunes = "freshtunes",
  Believe = "believe",
}

export enum ECountry {
  AU = "au",
  AT = "at",
  AZ = "az",
  AX = "ax",
  AL = "al",
  DZ = "dz",
  VI = "vi",
  AS = "as",
  AI = "ai",
  AO = "ao",
  AD = "ad",
  AQ = "aq",
  AG = "ag",
  AR = "ar",
  AM = "am",
  AW = "aw",
  AF = "af",
  BS = "bs",
  BD = "bd",
  BB = "bb",
  BH = "bh",
  BZ = "bz",
  BY = "by",
  BE = "be",
  BJ = "bj",
  BM = "bm",
  BG = "bg",
  BO = "bo",
  BQ = "bq",
  BA = "ba",
  BW = "bw",
  BR = "br",
  IO = "io",
  VG = "vg",
  BN = "bn",
  BF = "bf",
  BI = "bi",
  BT = "bt",
  VU = "vu",
  VA = "va",
  GB = "gb",
  HU = "hu",
  VE = "ve",
  UM = "um",
  TL = "tl",
  VN = "vn",
  GA = "ga",
  HT = "ht",
  GY = "gy",
  GM = "gm",
  GH = "gh",
  GP = "gp",
  GT = "gt",
  GF = "gf",
  GN = "gn",
  GW = "gw",
  DE = "de",
  GG = "gg",
  GI = "gi",
  HN = "hn",
  HK = "hk",
  GD = "gd",
  GL = "gl",
  GR = "gr",
  GE = "ge",
  GU = "gu",
  DK = "dk",
  JE = "je",
  DJ = "dj",
  DM = "dm",
  DO = "do",
  CD = "cd",
  EU = "eu",
  EG = "eg",
  ZM = "zm",
  EH = "eh",
  ZW = "zw",
  IL = "il",
  IN = "in",
  ID = "id",
  JO = "jo",
  IQ = "iq",
  IR = "ir",
  IE = "ie",
  IS = "is",
  ES = "es",
  IT = "it",
  YE = "ye",
  CV = "cv",
  KZ = "kz",
  KY = "ky",
  KH = "kh",
  CM = "cm",
  CA = "ca",
  QA = "qa",
  KE = "ke",
  CY = "cy",
  KG = "kg",
  KI = "ki",
  TW = "tw",
  KP = "kp",
  CN = "cn",
  CC = "cc",
  CO = "co",
  KM = "km",
  CR = "cr",
  CI = "ci",
  CU = "cu",
  KW = "kw",
  CW = "cw",
  LA = "la",
  LV = "lv",
  LS = "ls",
  LR = "lr",
  LB = "lb",
  LY = "ly",
  LT = "lt",
  LI = "li",
  LU = "lu",
  MU = "mu",
  MR = "mr",
  MG = "mg",
  YT = "yt",
  MO = "mo",
  MK = "mk",
  MW = "mw",
  MY = "my",
  ML = "ml",
  MV = "mv",
  MT = "mt",
  MA = "ma",
  MQ = "mq",
  MH = "mh",
  MX = "mx",
  FM = "fm",
  MZ = "mz",
  MD = "md",
  MC = "mc",
  MN = "mn",
  MS = "ms",
  MM = "mm",
  NA = "na",
  NR = "nr",
  NP = "np",
  NE = "ne",
  NG = "ng",
  NL = "nl",
  NI = "ni",
  NU = "nu",
  NZ = "nz",
  NC = "nc",
  NO = "no",
  AE = "ae",
  OM = "om",
  BV = "bv",
  IM = "im",
  CK = "ck",
  NF = "nf",
  CX = "cx",
  PN = "pn",
  SH = "sh",
  PK = "pk",
  PW = "pw",
  PS = "ps",
  PA = "pa",
  PG = "pg",
  PY = "py",
  PE = "pe",
  PL = "pl",
  PT = "pt",
  PR = "pr",
  CG = "cg",
  KR = "kr",
  RE = "re",
  RU = "ru",
  RW = "rw",
  RO = "ro",
  SV = "sv",
  WS = "ws",
  SM = "sm",
  ST = "st",
  SA = "sa",
  SZ = "sz",
  MP = "mp",
  SC = "sc",
  BL = "bl",
  MF = "mf",
  PM = "pm",
  SN = "sn",
  VC = "vc",
  KN = "kn",
  LC = "lc",
  RS = "rs",
  SG = "sg",
  SX = "sx",
  SY = "sy",
  SK = "sk",
  SI = "si",
  SB = "sb",
  SO = "so",
  SD = "sd",
  SR = "sr",
  US = "us",
  SL = "sl",
  TJ = "tj",
  TH = "th",
  TZ = "tz",
  TC = "tc",
  TG = "tg",
  TK = "tk",
  TO = "to",
  TT = "tt",
  TV = "tv",
  TN = "tn",
  TM = "tm",
  TR = "tr",
  UG = "ug",
  UZ = "uz",
  UA = "ua",
  WF = "wf",
  UY = "uy",
  FO = "fo",
  FJ = "fj",
  PH = "ph",
  FI = "fi",
  FK = "fk",
  FR = "fr",
  PF = "pf",
  TF = "tf",
  HM = "hm",
  HR = "hr",
  CF = "cf",
  TD = "td",
  ME = "me",
  CZ = "cz",
  CL = "cl",
  CH = "ch",
  SE = "se",
  SJ = "sj",
  LK = "lk",
  EC = "ec",
  GQ = "gq",
  ER = "er",
  EE = "ee",
  ET = "et",
  ZA = "za",
  GS = "gs",
  SS = "ss",
  JM = "jm",
  JP = "jp",
}

export enum EScheme {
  White = "white",
  Gray = "gray",
}

export enum EService {
  Zoundo = "zoundo",
  Tubyx = "tubyx",
  TubePays = "tubepays",
  Axtune = "axtune",
}

export enum EUserRole {
  Admin = "admin",
  Performer = "performer",
  Youtuber = "youtuber",
  Partner = "partner",
}

export enum ETransactionType {
  Payin = "payin",
  Payout = "payout",
  Referral = "referral",
  Spending = "spending",
  Selling = "selling",
  Promo = "promo",
  Other = "other",
}

export enum EMusicGenre {
  AlternativeAndPunk = "alternative-punk",
  Ambient = "ambient",
  Children = "children",
  Cinematic = "cinematic",
  Classical = "classical",
  CountryAndFolk = "country-folk",
  DanceAndElectronic = "dance-electronic",
  HipHopAndRap = "hip-hop-rap",
  Holiday = "holiday",
  JazzAndBlues = "jazz-blues",
  Pop = "pop",
  RnBAndSoul = "rnb-soul",
  Reggae = "reggae",
  Rock = "rock",
  Other = "other",
}

export enum ELanguage {
  Abkhazian = "ab",
  Afar = "aa",
  Afrikaans = "af",
  Akan = "ak",
  Albanian = "sq",
  Amharic = "am",
  Arabic = "ar",
  Aragonese = "an",
  Armenian = "hy",
  Assamese = "as",
  Avaric = "av",
  Avestan = "ae",
  Aymara = "ay",
  Azerbaijani = "az",
  Bambara = "bm",
  Bashkir = "ba",
  Basque = "eu",
  Belarusian = "be",
  Bengali = "bn",
  Bislama = "bi",
  Bosnian = "bs",
  Breton = "br",
  Bulgarian = "bg",
  Burmese = "my",
  Catalan = "ca",
  Chamorro = "ch",
  Chechen = "ce",
  Chichewa = "ny",
  Chinese = "zh",
  ChurchSlavonic = "cu",
  Chuvash = "cv",
  Cornish = "kw",
  Corsican = "co",
  Cree = "cr",
  Croatian = "hr",
  Czech = "cs",
  Danish = "da",
  Divehi = "dv",
  Dutch = "nl",
  Dzongkha = "dz",
  English = "en",
  Esperanto = "eo",
  Estonian = "et",
  Ewe = "ee",
  Faroese = "fo",
  Fijian = "fj",
  Finnish = "fi",
  French = "fr",
  WesternFrisian = "fy",
  Fulah = "ff",
  Gaelic = "gd",
  Galician = "gl",
  Ganda = "lg",
  Georgian = "ka",
  German = "de",
  Greek = "el",
  Kalaallisut = "kl",
  Guarani = "gn",
  Gujarati = "gu",
  Haitian = "ht",
  Hausa = "ha",
  Hebrew = "he",
  Herero = "hz",
  Hindi = "hi",
  HiriMotu = "ho",
  Hungarian = "hu",
  Icelandic = "is",
  Ido = "io",
  Igbo = "ig",
  Indonesian = "id",
  Interlingua = "ia",
  Interlingue = "ie",
  Inuktitut = "iu",
  Inupiaq = "ik",
  Irish = "ga",
  Italian = "it",
  Japanese = "ja",
  Javanese = "jv",
  Kannada = "kn",
  Kanuri = "kr",
  Kashmiri = "ks",
  Kazakh = "kk",
  CentralKhmer = "km",
  Kikuyu = "ki",
  Kinyarwanda = "rw",
  Kirghiz = "ky",
  Komi = "kv",
  Kongo = "kg",
  Korean = "ko",
  Kuanyama = "kj",
  Kurdish = "ku",
  Lao = "lo",
  Latin = "la",
  Latvian = "lv",
  Limburgan = "li",
  Lingala = "ln",
  Lithuanian = "lt",
  LubaKatanga = "lu",
  Luxembourgish = "lb",
  Macedonian = "mk",
  Malagasy = "mg",
  Malay = "ms",
  Malayalam = "ml",
  Maltese = "mt",
  Manx = "gv",
  Maori = "mi",
  Marathi = "mr",
  Marshallese = "mh",
  Mongolian = "mn",
  Nauru = "na",
  Navajo = "nv",
  NorthNdebele = "nd",
  SouthNdebele = "nr",
  Ndonga = "ng",
  Nepali = "ne",
  Norwegian = "no",
  NorwegianBokmal = "nb",
  NorwegianNynorsk = "nn",
  SichuanYi = "ii",
  Occitan = "oc",
  Ojibwa = "oj",
  Oriya = "or",
  Oromo = "om",
  Ossetian = "os",
  Pali = "pi",
  Pashto = "ps",
  Persian = "fa",
  Polish = "pl",
  Portuguese = "pt",
  Punjabi = "pa",
  Quechua = "qu",
  Romanian = "ro",
  Romansh = "rm",
  Rundi = "rn",
  Russian = "ru",
  NorthernSami = "se",
  Samoan = "sm",
  Sango = "sg",
  Sanskrit = "sa",
  Sardinian = "sc",
  Serbian = "sr",
  Shona = "sn",
  Sindhi = "sd",
  Sinhala = "si",
  Slovak = "sk",
  Slovenian = "sl",
  Somali = "so",
  SouthernSotho = "st",
  Spanish = "es",
  Sundanese = "su",
  Swahili = "sw",
  Swati = "ss",
  Swedish = "sv",
  Tagalog = "tl",
  Tahitian = "ty",
  Tajik = "tg",
  Tamil = "ta",
  Tatar = "tt",
  Telugu = "te",
  Thai = "th",
  Tibetan = "bo",
  Tigrinya = "ti",
  Tonga = "to",
  Tsonga = "ts",
  Tswana = "tn",
  Turkish = "tr",
  Turkmen = "tk",
  Twi = "tw",
  Uighur = "ug",
  Ukrainian = "uk",
  Urdu = "ur",
  Uzbek = "uz",
  Venda = "ve",
  Vietnamese = "vi",
  Volapuk = "vo",
  Walloon = "wa",
  Welsh = "cy",
  Wolof = "wo",
  Xhosa = "xh",
  Yiddish = "yi",
  Yoruba = "yo",
  Zhuang = "za",
  Zulu = "zu",
}

export enum EMailerFrom {
  Tubyx = "tubyx",
  Zoundo = "zoundo",
}

export enum EUserStatus {
  Review = "review",
  Active = "active",
  Reject = "reject",
  Suspend = "suspend",
  Block = "block",
}

export enum EReviewStatus {
  Draft = "draft",
  Review = "review",
  Approve = "approve",
  Reject = "reject",
}

export enum ESortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export interface IPagedData<T> {
  page: number;
  limit: number;
  count: number | null;
  pages: number | null;
  data: T[];
}

export enum EFieldGroup {
  TrackEdit = "track:edit",
  TrackFile = "track:file",
  TrackSample = "track:sample",
  TrackPerformer = "track:performer",
  TrackBatch = "track:batch",
  TrackOwner = "track:owner",
  TrackLimit = "track:limit",
  TrackViews = "track:views",
  TrackGenre = "track:genre",
  TrackMood = "track:mood",
  TrackLyrics = "track:lyrics",
  TrackIsrc = "track:isrc",
  TrackDuration = "track:duration",
  TrackStatus = "track:status",
  TrackLanguage = "track:language",
  TrackCost = "track:cost",
  TrackVideo = "track:video",
  TransactionUser = "transaction:user",
  TransactionFull = "transaction:full",
  PerformerUser = "performer:user",
  PerformerEdit = "performer:edit",
  PerformerUrls = "performer:urls",
  PerformerScheme = "performer:scheme",
  PerformerDistributor = "performer:distributor",
  PerformerStatus = "performer:status",
  BatchPerformer = "batch:performer",
  BatchContract = "batch:contract",
  BatchTracks = "batch:tracks",
  ApplicationUser = "application:user",
  VideoExtra = "video:extra",
  VideoDescription = "video:description",
  VideoTags = "video:tags",
  VideoTrack = "video:track",
  UserBalance = "user:balance",
  UserRef = "user:ref",
  UserSource = "user:source",
  UserDate = "user:date",
  UserLocale = "user:locale",
  UserIp = "user:ip",
  UserCountry = "user:country",
}

class Batches {
  private api: RestAPI;
  constructor(api: RestAPI) {
    this.api = api;
  }

  /** getBatchesList */
  getBatchesList = (
    request: IGetBatchesRequest,
    fields?: EFieldGroup[]
  ): Promise<IPagedData<IBatch>> => this.api.get(`/batches`, request, fields);

  /** getBatch */
  getBatch = (batch: TIdentifier, fields?: EFieldGroup[]): Promise<IBatch> =>
    this.api.get(`/batches/${batch}`, {}, fields);

  /** signOneBatch */
  signOneBatch = (
    batch: TIdentifier,
    request: ISignBatchContractRequest,
    fields?: EFieldGroup[]
  ): Promise<IBatch> =>
    this.api.get(`/batches/${batch}/sign/one`, request, fields);

  /** signTwoBatch */
  signTwoBatch = (
    batch: TIdentifier,
    request: ISignBatchContractRequest,
    fields?: EFieldGroup[]
  ): Promise<IBatch> =>
    this.api.get(`/batches/${batch}/sign/two`, request, fields);

  /** getApprovedTracksForBatch */
  getApprovedTracksForBatch = (
    performer: TIdentifier,
    fields?: EFieldGroup[]
  ): Promise<ITrack[]> =>
    this.api.get(
      `/batches/performers/${performer}/approved-tracks`,
      {},
      fields
    );

  /** createBatch */
  createBatch = (
    performer: TIdentifier,
    fields?: EFieldGroup[]
  ): Promise<IBatch> =>
    this.api.post(`/batches/performers/${performer}/batches`, {}, fields);
}

class Badges {
  private api: RestAPI;
  constructor(api: RestAPI) {
    this.api = api;
  }

  /** getAdminBadges */
  getAdminBadges = (fields?: EFieldGroup[]): Promise<IAdminBadges> =>
    this.api.get(`/badges/admin`, {}, fields);
}

class Billing {
  private api: RestAPI;
  constructor(api: RestAPI) {
    this.api = api;
  }

  /** getTrasnactionsHistory */
  getTrasnactionsHistory = (
    request: IGetTransactionsHistoryRequest,
    fields?: EFieldGroup[]
  ): Promise<IPagedData<ITransaction>> =>
    this.api.get(`/billing/transactions`, request, fields);
}

class Videos {
  private api: RestAPI;
  constructor(api: RestAPI) {
    this.api = api;
  }

  /** getVideoList */
  getVideoList = (
    request: IGetVideosRequest,
    fields?: EFieldGroup[]
  ): Promise<IPagedData<IVideo>> => this.api.get(`/videos`, request, fields);

  /** createVideo */
  createVideo = (
    request: ICreateVideoRequest,
    fields?: EFieldGroup[]
  ): Promise<IVideo> => this.api.post(`/videos`, request, fields);

  /** updateVideo */
  updateVideo = (
    video: TIdentifier,
    request: IUpdateVideoRequest,
    fields?: EFieldGroup[]
  ): Promise<IVideo> => this.api.patch(`/videos/${video}`, request, fields);

  /** getVideo */
  getVideo = (video: TIdentifier, fields?: EFieldGroup[]): Promise<IVideo> =>
    this.api.get(`/videos/${video}`, {}, fields);

  /** createProject */
  createProject = (
    video: TIdentifier,
    fields?: EFieldGroup[]
  ): Promise<IVideoProject> =>
    this.api.post(`/videos/${video}/project`, {}, fields);

  /** getProject */
  getProject = (
    project: TIdentifier,
    fields?: EFieldGroup[]
  ): Promise<IVideoProject> =>
    this.api.get(`/videos/projects/${project}`, {}, fields);

  /** updateProject */
  updateProject = (
    project: TIdentifier,
    request: IUpdateVideoProjectRequest,
    fields?: EFieldGroup[]
  ): Promise<IVideoProject> =>
    this.api.patch(`/videos/projects/${project}`, request, fields);
}

class Users {
  private api: RestAPI;
  constructor(api: RestAPI) {
    this.api = api;
  }

  /** getUsersList */
  getUsersList = (
    request: IGetUsersListRequest,
    fields?: EFieldGroup[]
  ): Promise<IPagedData<IUser>> => this.api.get(`/users`, request, fields);

  /** loginAs */
  loginAs = (
    user: TIdentifier,
    fields?: EFieldGroup[]
  ): Promise<{ token: string; user: IUser }> =>
    this.api.post(`/users/${user}/auth`, {}, fields);

  /** login */
  login = (
    request: ILoginRequest,
    fields?: EFieldGroup[]
  ): Promise<{ token: string; user: IUser }> =>
    this.api.post(`/users/login`, request, fields);

  /** beginPasswordReset */
  beginPasswordReset = (
    request: IBeginPasswordResetRequest,
    fields?: EFieldGroup[]
  ): Promise<true> => this.api.post(`/users/password`, request, fields);

  /** finishPasswordReset */
  finishPasswordReset = (
    request: IFinishPasswordResetRequest,
    fields?: EFieldGroup[]
  ): Promise<true> => this.api.post(`/users/password/`, request, fields);

  /** getMe */
  getMe = (fields?: EFieldGroup[]): Promise<IUser> =>
    this.api.get(`/users/me`, {}, fields);

  /** getUserById */
  getUserById = (user: TIdentifier, fields?: EFieldGroup[]): Promise<IUser> =>
    this.api.get(`/users/${user}`, {}, fields);
}

class Assets {
  private api: RestAPI;
  constructor(api: RestAPI) {
    this.api = api;
  }

  /** getAsset */
  getAsset = (asset: TIdentifier, fields?: EFieldGroup[]): Promise<IAsset> =>
    this.api.get(`/assets/${asset}`, {}, fields);

  /** uploadJson */
  uploadJson = (
    request: IUploadRequest,
    fields?: EFieldGroup[]
  ): Promise<IAsset> => this.api.post(`/assets/upload/base64`, request, fields);

  /** uploadForm */
  uploadForm = (form: FormData): Promise<IAsset> =>
    this.api.post(`/assets/upload/form`, form);

  /** beginPartial */
  beginPartial = (
    request: IInitPartialUploadRequest,
    fields?: EFieldGroup[]
  ): Promise<IPartialUploadStatus> =>
    this.api.post(`/assets/upload/partial`, request, fields);

  /** chunkPartial */
  chunkPartial = (
    request: IPartialChunkUploadRequest,
    fields?: EFieldGroup[]
  ): Promise<IPartialUploadStatus> =>
    this.api.patch(`/assets/upload/partial`, request, fields);
}

class Main {
  private api: RestAPI;
  constructor(api: RestAPI) {
    this.api = api;
  }

  /** checkVersion */
  checkVersion = (
    item: TIdentifier,
    version: TIdentifier,
    fields?: EFieldGroup[]
  ): Promise<{ version: string; upgrade: boolean }> =>
    this.api.get(`/version/${item}/${version}`, {}, fields);
}

class Tasks {
  private api: RestAPI;
  constructor(api: RestAPI) {
    this.api = api;
  }

  /** getTask */
  getTask = <T>(id: TIdentifier, fields?: EFieldGroup[]): Promise<T> =>
    this.api.get(`/tasks/${id}`, {}, fields);

  /** generateTrackCover */
  generateTrackCover = (
    request: IGenerateTrackCoverRequest,
    fields?: EFieldGroup[]
  ): Promise<IGenerateTrackCoverTask> =>
    this.api.post(`/tasks/tracks/cover/generate`, request, fields);

  /** generateVideoProject */
  generateVideoProject = (
    project: TIdentifier,
    fields?: EFieldGroup[]
  ): Promise<IGenerateVideoTask> =>
    this.api.post(`/tasks/videos/projects/${project}/generate`, {}, fields);

  /** updateTask */
  updateTask = <T>(
    id: TIdentifier,
    request: IUpdateTaskRequest,
    fields?: EFieldGroup[]
  ): Promise<T> => this.api.patch(`/tasks/${id}`, request, fields);
}

class Tracks {
  private api: RestAPI;
  constructor(api: RestAPI) {
    this.api = api;
  }

  /** getTracksList */
  getTracksList = (
    request: IGetTracksRequest,
    fields?: EFieldGroup[]
  ): Promise<IPagedData<ITrack>> => this.api.get(`/tracks`, request, fields);

  /** getRemainingVideoTracks */
  getRemainingVideoTracks = (fields?: EFieldGroup[]): Promise<ITrack[]> =>
    this.api.get(`/tracks/remaining-video`, {}, fields);

  /** addTrack */
  addTrack = (
    request: IAddTrackRequest,
    fields?: EFieldGroup[]
  ): Promise<ITrack> => this.api.post(`/tracks`, request, fields);

  /** updateTrack */
  updateTrack = (
    track: TIdentifier,
    request: IUpdateTrackRequest,
    fields?: EFieldGroup[]
  ): Promise<ITrack> => this.api.patch(`/tracks/${track}`, request, fields);

  /** getLastPerformerTrack */
  getLastPerformerTrack = (
    performer: TIdentifier,
    fields?: EFieldGroup[]
  ): Promise<ITrack | null> =>
    this.api.get(`/tracks/last/${performer}`, {}, fields);

  /** getTrack */
  getTrack = (track: TIdentifier, fields?: EFieldGroup[]): Promise<ITrack> =>
    this.api.get(`/tracks/${track}`, {}, fields);

  /** deleteTrack */
  deleteTrack = (track: TIdentifier, fields?: EFieldGroup[]): Promise<true> =>
    this.api.delete(`/tracks/${track}`, {}, fields);

  /** draftTrack */
  draftTrack = (track: TIdentifier, fields?: EFieldGroup[]): Promise<true> =>
    this.api.patch(`/tracks/${track}/draft`, {}, fields);

  /** approveTrack */
  approveTrack = (
    track: TIdentifier,
    request: IApproveTrackRequest,
    fields?: EFieldGroup[]
  ): Promise<true> =>
    this.api.patch(`/tracks/${track}/approve`, request, fields);

  /** rejectTrack */
  rejectTrack = (
    track: TIdentifier,
    request: ICommonRejectRequest,
    fields?: EFieldGroup[]
  ): Promise<true> =>
    this.api.patch(`/tracks/${track}/reject`, request, fields);

  /** reviewTrack */
  reviewTrack = (track: TIdentifier, fields?: EFieldGroup[]): Promise<true> =>
    this.api.patch(`/tracks/${track}/review`, {}, fields);
}

class Performers {
  private api: RestAPI;
  constructor(api: RestAPI) {
    this.api = api;
  }

  /** getList */
  getList = (
    request: IGetPerformersListRequest,
    fields?: EFieldGroup[]
  ): Promise<IPagedData<IPerformer>> =>
    this.api.get(`/performers`, request, fields);

  /** createPerformer */
  createPerformer = (
    request: ICreatePerformerRequest,
    fields?: EFieldGroup[]
  ): Promise<IPerformer> => this.api.post(`/performers`, request, fields);

  /** getPerformer */
  getPerformer = (
    performer: TIdentifier,
    fields?: EFieldGroup[]
  ): Promise<IPerformer> =>
    this.api.get(`/performers/${performer}`, {}, fields);

  /** updatePerformer */
  updatePerformer = (
    performer: TIdentifier,
    request: IUpdatePerformerRequest,
    fields?: EFieldGroup[]
  ): Promise<IPerformer> =>
    this.api.patch(`/performers/${performer}`, request, fields);

  /** reviewPerformer */
  reviewPerformer = (
    performer: TIdentifier,
    fields?: EFieldGroup[]
  ): Promise<IPerformer> =>
    this.api.post(`/performers/${performer}/review`, {}, fields);

  /** draftPerformer */
  draftPerformer = (
    performer: TIdentifier,
    fields?: EFieldGroup[]
  ): Promise<IPerformer> =>
    this.api.post(`/performers/${performer}/draft`, {}, fields);

  /** approvePerformer */
  approvePerformer = (
    performer: TIdentifier,
    fields?: EFieldGroup[]
  ): Promise<IPerformer> =>
    this.api.post(`/performers/${performer}/approve`, {}, fields);

  /** rejectPerformer */
  rejectPerformer = (
    performer: TIdentifier,
    request: ICommonRejectRequest,
    fields?: EFieldGroup[]
  ): Promise<IPerformer> =>
    this.api.post(`/performers/${performer}/reject`, request, fields);

  /** deletePerformer */
  deletePerformer = (
    performer: TIdentifier,
    fields?: EFieldGroup[]
  ): Promise<boolean> =>
    this.api.delete(`/performers/${performer}`, {}, fields);
}

class Notifications {
  private api: RestAPI;
  constructor(api: RestAPI) {
    this.api = api;
  }

  /** getList */
  getList = (fields?: EFieldGroup[]): Promise<INotification[]> =>
    this.api.get(`/notifications`, {}, fields);

  /** read */
  read = (
    notification: TIdentifier,
    fields?: EFieldGroup[]
  ): Promise<INotification> =>
    this.api.patch(`/notifications/${notification}`, {}, fields);

  /** readAll */
  readAll = (fields?: EFieldGroup[]): Promise<boolean> =>
    this.api.patch(`/notifications`, {}, fields);

  /** delete */
  delete = (
    notification: TIdentifier,
    fields?: EFieldGroup[]
  ): Promise<boolean> =>
    this.api.delete(`/notifications/${notification}`, {}, fields);

  /** deleteAll */
  deleteAll = (fields?: EFieldGroup[]): Promise<boolean> =>
    this.api.delete(`/notifications`, {}, fields);
}

class Applications {
  private api: RestAPI;
  constructor(api: RestAPI) {
    this.api = api;
  }

  /** submitPerformerApplication */
  submitPerformerApplication = (
    request: IPerformerApplicationSubmitRequest,
    fields?: EFieldGroup[]
  ): Promise<number> =>
    this.api.post(`/applications/performer`, request, fields);

  /** getPerformerApplications */
  getPerformerApplications = (
    request: IGetPerformerApplicationsRequest,
    fields?: EFieldGroup[]
  ): Promise<IPagedData<IPerformerApplication>> =>
    this.api.get(`/applications/performer`, request, fields);

  /** rejectPerformerApplication */
  rejectPerformerApplication = (
    application: TIdentifier,
    request: ICommonRejectRequest,
    fields?: EFieldGroup[]
  ): Promise<IPerformerApplication> =>
    this.api.post(
      `/applications/performer/${application}/reject`,
      request,
      fields
    );

  /** approvePerformerApplication */
  approvePerformerApplication = (
    application: TIdentifier,
    request: IApprovePerformerApplicationRequest,
    fields?: EFieldGroup[]
  ): Promise<IPerformerApplication> =>
    this.api.post(
      `/applications/performer/${application}/approve`,
      request,
      fields
    );
}
