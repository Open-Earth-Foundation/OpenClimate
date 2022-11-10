# Messages

## Invitations
TODO: Multi-use invitations and OOB invitations

### Generate a Single-Use Invitation
SPA -> Controller
Context: INVITATIONS
Type: CREATE_SINGLE_USE
Data: 
```
{
  workflow: 'immunization'  // Can be null or undefined
}
```

### Receive a Single-Use Invitation

Controller -> SPA
Context: INVITATIONS
Type: INVITATION
Data: 
```
{
  invitation_record:
  {
    connection_id: '18a5b7a0-9380-4422-b930-efd2c9363492',
    invitation:{ 
      '@type':
      'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation',
       '@id': 'bedc9ffa-36c1-44cc-ad78-e5082661abce',
       recipientKeys: [ 'Csjg8kuZreanP5U8W18c29GpUouW3KpPKvQdquWyTx6y' ],
       label: 'Enterprise',
       serviceEndpoint: 'https://d00e4066779b.ngrok.io' 
    },
    invitation_url: 'https://d00e4066779b.ngrok.io?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiYmVkYzlmZmEtMzZjMS00NGNjLWFkNzgtZTUwODI2NjFhYmNlIiwgInJlY2lwaWVudEtleXMiOiBbIkNzamc4a3VacmVhblA1VThXMThjMjlHcFVvdVczS3BQS3ZRZHF1V3lUeDZ5Il0sICJsYWJlbCI6ICJFbnRlcnByaXNlIiwgInNlcnZpY2VFbmRwb2ludCI6ICJodHRwczovL2QwMGU0MDY2Nzc5Yi5uZ3Jvay5pbyJ9',
    alias: 'Enterprise Invite'
  }
}
```

### Single-Use Invitation Consumption

Controller -> SPA
Context: INVITATIONS
Type: SINGLE_USE_USED
Data: 
```
{
  workflow: 'immunization',  // Can be null or undefined
  connection_id: '18a5b7a0-9380-4422-b930-efd2c9363492',
}
```


## Contacts

### Get Contacts
TODO: Add Pagination
Data parameter additional_tables to specify additional tables to fetch beyond the core tables in relation to a contact

SPA -> Controller
Context: CONTACTS
Type: GET_ALL
Data: 
```
{
  additional_tables: ["Demographic"]
}
```

### Get a Contact

SPA -> Controller
Context: CONTACTS
Type: GET
Data: 
```
{
  contact_id: 212,
  additional_tables: ["Demographic"]
}
```

### Send Contact(s)
Specifies what additional tables are being sent. We will configure some to be sent by default, while others may need to be explicitely requested

May be one or multiple contacts. Should be used to update local UI state.

Controller -> SPA
Context: CONTACTS
Type: CONTACTS
Data:
```
{
  contacts: [
    {
      contact_id: 212,
      created_at: "2020-10-13T23:31:07.490Z",
      updated_at: "2020-10-13T23:33:43.490Z",
      label: "John Doe",
      meta_data: {
        _additionaldata_
      },
      Connections: [
        {
          accept: "auto",
          alias: "John Doe",
          connection_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          connections_to_contacts: {
            contact_id: 1, connection_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          },
          created_at: "2020-10-13T23:31:07.190Z",
          error_msg: "No DIDDoc provided; cannot connect to public DID",
          inbound_connection_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          initiator: "self",
          invitation: {
            '@type':'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation',
            '@id': 'bedc9ffa-36c1-44cc-ad78-e5082661abce',
            recipientKeys: [ 'Csjg8kuZreanP5U8W18c29GpUouW3KpPKvQdquWyTx6y' ],
            routingKeys: [ 'Csjg8kuZreanP5U8W18c29GpUouW3KpPKvQdquWyTx6y' ],
            label: 'Enterprise',
            serviceEndpoint: 'https://d00e4066779b.ngrok.io'
          },
          invitation_key: "H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV",
          invitation_mode: "once",
          invitation_url: "http://192.168.56.101:8020/invite?c_i=eyJAdHlwZSI6Li4ufQ==",
          my_did: "WgWxqztrNooG92RXvxSTWv",
          request_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          routing_state: "active",
          state: "active",
          their_did: "WgWxqztrNooG92RXvxSTWv",
          their_label: "John Doe",
          their_role: "Patient",
          updated_at: "2020-10-13T23:31:07.190Z"
        },
        ...
      ],
      additional_tables: ["Demographic"]
    },
    ...
  ],
}
```

#### Additional Tables:
```
Demographic: {
  contact_id: 3,
  first_name: "John",
  middle_name: "Michael",
  last_name: "Doe",
  date_of_birth: "2003-10-13T23:31:07.190Z",
  gender: "male",
  mpid: "42352",
  address: {
    Address 1:  "123 Abc Street",
    Address 2:  "Apt 3",
    City:  "New York City",
    State:  "New York",
    Zip Code:  "10034",
    Country:  "United States",
  },
  phone: "123-456-789"
}
```

### Create or Update Demographic Data

SPA -> Controller
Context: DEMOGRAPHICS
Type: UPDATE_OR_CREATE
Data:
```
{
	contact_id: 3,
  mpid: "42352",
  first_name: "John",
  middle_name: "Michael",
  last_name: "Doe",
  date_of_birth: "2003-10-13T23:31:07.190Z",
  gender: "male",
  phone: "123-456-789",
  address: {
    address_1:  "123 Abc Street",
    address_2:  "Apt 3",
    city:  "New York City",
    state:  "New York",
    zip_code:  "10034",
    country:  "United States",
  }
}
```


## Issued Credentials
  
### Get All Issued Credentials

SPA -> Controller
Context: CREDENTIALS
Type: GET_ALL
Data:
```
{}
```


### Get an Issued Credential

SPA -> Controller
Context: CREDENTIALS
Type: GET
Data:
```
{
  credential_exchange_id: '2a96f2d5-e9c8-42c3-a297-83dda3e03595'
}
```


### Send Issued Credential(s)

May be one or multiple credentials. Should be used to update local UI state. Unique Key is the credential_exchange_id.
Credential Values should be taken from credential.values. It could also be appropriate to use credential_proposal_dict.credential_proposal.attributes. These will sometimes be null. State can be relied on to always be present. 

Controller -> SPA
Context: CREDENTIALS
Type: CREDENTIALS
Data:
```
{
  credential_records:
  [
    {
      credential_exchange_id: '2a96f2d5-e9c8-42c3-a297-83dda3e03595',  //Primary Key
      credential_id: '2a96f2d5-e9c8-42c3-a297-83dda3e03595',
      credential:
      { 
        schema_id: 'W1vtCQVTy1aMJAjsHt5UK4:2:Covid_19_Lab_Result:1.3',
        cred_def_id: '9M4EmNFC3C1fSvMgbS9JXs:3:CL:125221:default',
        rev_reg_id: null,
        values:
        { 
          "lab_coding_qualifier": {
            "raw": "345a55",
            "encoded": "102987336249554097029535212322581322789799900648198034993379397001115665086549"
          },
          "patient_state": {
            "raw": "",
            "encoded": "102987336249554097029535212322581322789799900648198034993379397001115665086549"
          },
          "lab_description": {
            "raw": "Covid-19 PCR Test",
            "encoded": "99776853589627326085103034934332674993657236683641304316331345430176047275031"
          },
          ...
        },
        signature: { p_credential: [Object], r_credential: null },
        signature_correctness_proof:
         { 
           se:
            '16000596602764939287113930893068846104362....',
           c:
            '78194481618228153881845858179108710053202....' 
          },
        rev_reg: null,
        witness: null 
      },
      raw_credential: 
      {...},
      revocation_id: "...",

      connection_id: '27dd6bd1-653e-429b-8d01-c6282d3525be',
      state: 'credential_issued',
      role: 'issuer',
       initiator: 'self',

       thread_id: 'eb412c84-2751-4a1d-9f63-e26f17bc33c8',
       parent_thread_id: 'eb312c84-653e-429b-8d01-c6282d3525be',

      schema_id: 'W1vtCQVTy1aMJAjsHt5UK4:2:Covid_19_Lab_Result:1.3',
       credential_definition_id: '9M4EmNFC3C1fSvMgbS9JXs:3:CL:125221:default' 
       revoc_reg_id: "...",

      auto_issue: true,
      auto_offer: false,
       auto_remove: false,

       error_msg: "Error Message",
      trace: false,

       created_at: '2020-10-14 21:45:16.788803Z',
       updated_at: '2020-10-14 21:47:45.993019Z',

       credential_proposal_dict:
      { 
        '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/propose-credential',
        '@id': '46276571-627b-4053-8f78-61acc3aca8a9',
        schema_version: '1.3',
        schema_issuer_did: 'W1vtCQVTy1aMJAjsHt5UK4',
        schema_id: 'W1vtCQVTy1aMJAjsHt5UK4:2:Covid_19_Lab_Result:1.3',
        comment: '',
        cred_def_id: '9M4EmNFC3C1fSvMgbS9JXs:3:CL:125221:default',
        credential_proposal:
        { 
           '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview',
          attributes:  [
            {
              "name": "result",
              "mime-type": "string",
              "value": "negative"
            },
            {
              "name": "sending_facility",
              "value": "HIE"
            },
            {
              "name": "lab_specimen_collected_date",
              "mime-type": "image/jpeg",
              "value": ""
            },
            ...
          ]
        },
        schema_name: 'Covid_19_Lab_Result',
        issuer_did: '9M4EmNFC3C1fSvMgbS9JXs' 
      },

      credential_offer:
      { 
        schema_id: 'W1vtCQVTy1aMJAjsHt5UK4:2:Covid_19_Lab_Result:1.3',
        cred_def_id: '9M4EmNFC3C1fSvMgbS9JXs:3:CL:125221:default',
        key_correctness_proof:
         { c:
            '14683981184184136....',
           xz_cap:
            '9739055328477192836400....',
           xr_cap: [Array] },
        nonce: '143813257708841485989378' 
      },

      credential_offer_dict:
      { 
        '@type':
        'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/offer-credential',
        '@id': 'eb412c84-2751-4a1d-9f63-e26f17bc33c8',
        '~thread': {},
        comment: 'create automated credential exchange',
        credential_preview:
        { 
           '@type':
            'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview',
          attributes: [Array] 
         },
        'offers~attach': [ [Object] ] 
      },

       credential_request:
      { 
        prover_did: '7eLheqhzKKUx29obLrS5X3',
        cred_def_id: '9M4EmNFC3C1fSvMgbS9JXs:3:CL:125221:default',
        blinded_ms:
         { u:
            '772429144704113156916....',
           ur: null,
           hidden_attributes: [Array],
           committed_attributes: {} },
        blinded_ms_correctness_proof:
         { c:
            '55109999700574797196275...',
           v_dash_cap:
            '148223596114792115881228...',
           m_caps: [Object],
           r_caps: {} },
        nonce: '1168035697582091317212130' 
      }
    },
    ...
  ]
}
```

### Issue a Credential

TODO:
SPA -> Controller
Context: CREDENTIALS
Type: ISSUE
Data:

### Issue a Credential Based Off of a Schema

Correlates Credential Definition From Supplied Schema ID

SPA -> Controller
Context: CREDENTIALS
Type: ISSUE_USING_SCHEMA
Data:
```
{
  connectionID: "2a5db91d-0ae9-4d83-a1f0-236c6f7ed879",
  schemaID: "W1vtCQVTy1aMJAjsHt5UK4:2:Covid_19_Lab_Result:1.3",
  schemaVersion: "1.3",
  schemaName: "Covid_19_Lab_Result",
  schemaIssuerDID: "W1vtCQVTy1aMJAjsHt5UK4",
  comment: 'Credential Issuance Description',
  attributes: [
    {
      "name": "result",
      "value": "negative"
    },
    {
      "name": "sending_facility",
      "value": "HIE"
    },
    {
      "name": "lab_specimen_collected_date",
      "value": "2020-09-21 00:00:00"
    },
    ...
  ]
}
```

## Presentations

### Presentation Occurred

(JamesKEbert) TODO: Alter Presentations Messaging format. Likely want to add additional fields in the data to genericize presentations.

Controller -> SPA
Context: PRESENTATIONS
Type: VERIFIED
Data:
```
'PRESENTATIONS', 'VERIFIED', {
  'connection_id': '2a5db91d-0ae9-4d83-a1f0-236c6f7ed879'
}
```


## Settings

### Set Settings

SPA -> Controller
Context: SETTINGS
Type: SET_THEME
Data:
```
{
  theme: {}
}
```

### Get Settings

SPA -> Controller
Context: SETTINGS
Type: GET_THEME
Data:
```
{}
```

### Send Settings

Controller -> SPA
Context: SETTINGS
Type: THEME_SETTINGS
Data:
```
{
  theme: {}
}
```
