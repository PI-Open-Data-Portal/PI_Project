import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone/esm/vis-network";

function GrafoViewer() {
  const containerRef = useRef(null);
  const [modalData, setModalData] = useState(null);

  // Mock data embedded directly in the component
  const mockData = {
    "nodes": [
    {
      "id": "7a02c4c3-e715-4af7-b0c9-e11ba1afa889",
      "label": "Subexpressão",
      "shape": "ellipse",
      "color": "#F3A1A1"
    },
    {
      "id": "PSA1543262",
      "label": "PSA1543262",
      "title": "Tabela: E_jultosPSA_trans_equip_movement",
      "color": "#A1C9F1"
    },
    {
      "id": "cb3bd863-9b6a-4d9f-97e8-350bd761c097",
      "label": "Subexpressão",
      "shape": "ellipse",
      "color": "#F3A1A1"
    },
    {
      "id": "e7d21883-82db-4f3d-9ad6-94dc914302f8",
      "label": "Subexpressão",
      "shape": "ellipse",
      "color": "#F3A1A1"
    },
    {
      "id": "JVC107",
      "label": "JVC107",
      "title": "Tabela: E_julgn_vessel_call",
      "color": "#A1C9F1"
    },
    {
      "id": "JNA1325",
      "label": "JNA1325",
      "title": "Tabela: E_julgn_notice_of_arrival",
      "color": "#A1C9F1"
    },
    {
      "id": "JM2152",
      "label": "JM2152",
      "title": "Tabela: E_julcm_manifest",
      "color": "#A1C9F1"
    },
    {
      "id": "JTD537189",
      "label": "JTD537189",
      "title": "Tabela: E_julcm_transport_document",
      "color": "#A1C9F1"
    },
    {
      "id": "JTDE384486",
      "label": "JTDE384486",
      "title": "Tabela: E_julcm_transport_document_equipment",
      "color": "#A1C9F1"
    },
    {
      "id": "JCT8055",
      "label": "JCT8055",
      "title": "Tabela: E_julmd_container_type",
      "color": "#A1C9F1"
    },
    {
      "id": "JTE801800",
      "label": "JTE801800",
      "title": "Tabela: E_julmd_transport_equipment",
      "color": "#A1C9F1"
    },
    {
      "id": "JML2",
      "label": "JML2",
      "title": "Tabela: jul_md_lov",
      "color": "#A1C9F1"
    },
    {
      "id": "JGD554398",
      "label": "JGD554398",
      "title": "Tabela: E_julcm_goods_detail",
      "color": "#A1C9F1"
    },
    {
      "id": "JGDS1428440",
      "label": "JGDS1428440",
      "title": "Tabela: E_julcm_goods_detail_split",
      "color": "#A1C9F1"
    },
    {
      "id": "JHG7941",
      "label": "JHG7941",
      "title": "Tabela: E_julmd_harmonized_goods",
      "color": "#A1C9F1"
    },
    {
      "id": "HC21701",
      "label": "HC21701",
      "title": "Tabela: HC_NST2007",
      "color": "#A1C9F1"
    }
  ],
  "edges": [
    {
      "from": "7a02c4c3-e715-4af7-b0c9-e11ba1afa889",
      "to": "PSA1543262",
      "label": "."
    },
    {
      "from": "7a02c4c3-e715-4af7-b0c9-e11ba1afa889",
      "to": "cb3bd863-9b6a-4d9f-97e8-350bd761c097",
      "label": "."
    },
    {
      "from": "cb3bd863-9b6a-4d9f-97e8-350bd761c097",
      "to": "e7d21883-82db-4f3d-9ad6-94dc914302f8",
      "label": "."
    },
    {
      "from": "e7d21883-82db-4f3d-9ad6-94dc914302f8",
      "to": "JVC107",
      "label": "."
    },
    {
      "from": "e7d21883-82db-4f3d-9ad6-94dc914302f8",
      "to": "JNA1325",
      "label": "."
    },
    {
      "from": "e7d21883-82db-4f3d-9ad6-94dc914302f8",
      "to": "JM2152",
      "label": "."
    },
    {
      "from": "e7d21883-82db-4f3d-9ad6-94dc914302f8",
      "to": "JTD537189",
      "label": "."
    },
    {
      "from": "e7d21883-82db-4f3d-9ad6-94dc914302f8",
      "to": "JTDE384486",
      "label": "."
    },
    {
      "from": "e7d21883-82db-4f3d-9ad6-94dc914302f8",
      "to": "JCT8055",
      "label": "."
    },
    {
      "from": "e7d21883-82db-4f3d-9ad6-94dc914302f8",
      "to": "JTE801800",
      "label": "."
    },
    {
      "from": "e7d21883-82db-4f3d-9ad6-94dc914302f8",
      "to": "JCT8055",
      "label": "."
    },
    {
      "from": "e7d21883-82db-4f3d-9ad6-94dc914302f8",
      "to": "JML2",
      "label": "."
    },
    {
      "from": "cb3bd863-9b6a-4d9f-97e8-350bd761c097",
      "to": "JGD554398",
      "label": "."
    },
    {
      "from": "cb3bd863-9b6a-4d9f-97e8-350bd761c097",
      "to": "JGDS1428440",
      "label": "."
    },
    {
      "from": "cb3bd863-9b6a-4d9f-97e8-350bd761c097",
      "to": "JHG7941",
      "label": "."
    },
    {
      "from": "7a02c4c3-e715-4af7-b0c9-e11ba1afa889",
      "to": "HC21701",
      "label": "."
    }
  ],
  "modal_info": {
    "PSA1543262": {
      "table": "E_jultosPSA_trans_equip_movement",
      "dados": {
        "id": "3642797c-ea1a-4d58-a3f1-2b3155a4873e",
        "creation_date": "2023-06-15T01:20:07.277000",
        "version_date": "2023-06-16T14:35:56",
        "version_number": 3,
        "agent_id": "c675b807-6a70-4e06-8973-66084fe8b3ad",
        "attached_equipment": null,
        "bill_of_lading": null,
        "booking_number": "NX323A",
        "cargo_handling_type_id": null,
        "community": false,
        "cons_dec_type_id": null,
        "container_height": 8,
        "container_length": 20,
        "container_type_id": "c2c17575-c516-4d44-8c6d-53c830e9903c",
        "container_width": 8,
        "damage_observations": null,
        "dangerous_goods": false,
        "delivery_local_id": null,
        "delivery_local_locode_id": "e510c222-a1e4-4807-89ef-3b4bc0f11171",
        "destination_train_station_id": null,
        "yard_id": null,
        "direct_traffic": false,
        "electric_power": false,
        "end_bay": null,
        "equip_weight_certificate": null,
        "expiration_datetime": null,
        "export_warehouse": false,
        "final_destination_local_id": null,
        "final_destination_locode_id": null,
        "final_port_disembarkation_id": null,
        "full": true,
        "general_information": null,
        "goods_data_id": null,
        "goods_description": "GLYCOLINE, XTERN RUMIANTES 1.5%",
        "gross_weight": 21200.0,
        "handling_instructions": null,
        "means_of_transport_id": null,
        "message_reference": null,
        "movement_datetime": "2023-06-15T01:06:00",
        "mrn_number": null,
        "observations": null,
        "operation_local_id": "88228a84-65b0-4482-b9d3-70b39d4cd266",
        "origin_train_station_id": null,
        "port_of_disembarkation_id": "f538a5fb-e5df-487d-8667-2a24fbb9b773",
        "port_of_embarkation_id": "704d8c52-24bb-48f2-92b9-10accf987b6a",
        "power_supply_entity_id": null,
        "previous_passage_id": null,
        "quantity": null,
        "reception_local_id": "88228a84-65b0-4482-b9d3-70b39d4cd266",
        "reception_local_locode_id": "61c47a13-2f1d-4fe6-aaa7-2822e4e7d3d2",
        "responsible_entity_id": null,
        "slot_number": null,
        "start_bay": null,
        "summary_declaration_number": null,
        "swap_body": false,
        "tare": 2160,
        "temperature": null,
        "temperature_max_variation": null,
        "temperature_min_variation": null,
        "temperature_type_id": null,
        "temperature_unit_id": null,
        "temperature_unit_variation_id": null,
        "teu_container_length": 1.0,
        "tier": null,
        "train_wagon_id": null,
        "train_wagon_position": null,
        "transport_equipment_action_id": "83cd4df7-1e5d-4f88-b04f-17d1cf2634ce",
        "verification_gross_mass_date": null,
        "verified_gross_mass": 21200.0,
        "weighing_entity_info_id": null,
        "weighing_method_id": null,
        "weighing_official": null,
        "weighing_reference_number": null,
        "generic_movement_document_id": "ce5e8f50-ad52-49dd-bf91-89a4fb7c62d9",
        "passage_id": "b507bd56-6660-4224-875f-0b07f96a11ee",
        "creation_substitute_type": null,
        "version_substitute_type": null,
        "plate_number": "FCIU4465304",
        "transport_equipment_type_id": "5bb84bc0-d1de-4559-93e6-a6427face02e",
        "weighing_business_entity_id": null,
        "weighing_entity_id": null,
        "customs_regime": null,
        "movement_by_booking": false,
        "source": "MESSAGE",
        "document_type": "EMBARKATION_REPORT",
        "prov": "PSA1543262"
      }
    },
    "JVC107": {
      "table": "E_julgn_vessel_call",
      "dados": {
        "id": "d621929a-e0ae-49c6-8dae-dd35d3abfa6c",
        "creation_date": "2023-05-12T11:09:04.773000",
        "creation_substitute_user": null,
        "creation_user": "hugo.moreira@msc.com",
        "version_date": "2023-06-13T09:22:55.543000",
        "version_number": 2,
        "agent_internal_number": null,
        "departure_travel_number": null,
        "description": null,
        "etd_document_reference": null,
        "etd_document_version": null,
        "generated": false,
        "access_type_id": null,
        "business_entity_id": "c675b807-6a70-4e06-8973-66084fe8b3ad",
        "port_of_call_id": "704d8c52-24bb-48f2-92b9-10accf987b6a",
        "ship_particulars_id": "5acb8750-1e50-4da9-be3b-793826626a3f",
        "id_ship_type": "8df60df4-cb05-47af-81fe-ff891909f865",
        "name": null,
        "number": "PTSIE123000818",
        "observations": null,
        "poc_locode_code": "PTSIE",
        "poc_locode_id": null,
        "poc_locode_name": "Sines",
        "publish": false,
        "ship_gt": 112836,
        "ship_loa": 330.0,
        "ship_maximum_draught": 16.0,
        "ship_name": "CAPE SOUNIO",
        "ship_particulars_vers_number": "15",
        "ship_type_code": "Porta-Contentores",
        "status_code": "ACT",
        "status_desc": "Ativo",
        "status_id": "02fd40f9-7094-4b2b-911e-7afd903d18e1",
        "travel_number": null,
        "creation_substitute_type": null,
        "version_substitute_type": null,
        "from_migration": null,
        "prov": "JVC107"
      }
    },
    "JNA1325": {
      "table": "E_julgn_notice_of_arrival",
      "dados": {
        "id": "bdbfee96-58db-4d6c-992c-3fb7e088eb3b",
        "creation_date": "2023-05-12T11:09:05.520000",
        "version_date": "2023-06-14T12:59:03.687000",
        "version_number": 3,
        "business_entity_identification": "502614447",
        "business_entity_name": "MSC Portugal, S.A.",
        "classified": null,
        "closed": null,
        "declarant_identification": "502614447",
        "declarant_name": "MSC Portugal, S.A.",
        "delay_justification": null,
        "business_entity_id": "c675b807-6a70-4e06-8973-66084fe8b3ad",
        "declarant_id": "c675b807-6a70-4e06-8973-66084fe8b3ad",
        "id_last_selected_port_aux_info": null,
        "justification": "Sem justificação necessária",
        "number": "PTSIENOA23000818",
        "observations": null,
        "state_code": "CONF",
        "state_desc": "Confirmado",
        "state_id": "5339cb73-c258-4958-92b1-e3ef8666fe19",
        "anchoring_on_arrival": false,
        "bags": false,
        "ballast_tank": false,
        "ballast_type_desc": null,
        "ballast_type_id": null,
        "captain_id": "b889bb39-2434-4f9b-8503-145ae4b92d0f",
        "cargo_class_1": false,
        "cargo_class_51": false,
        "carries_acrylonitrile": false,
        "castastrophe_description": null,
        "catastrophe_risk": false,
        "condition_cargo_ballast_tank": null,
        "contigency_number": null,
        "customs_regular_line_reference": null,
        "dangerous_goods_desc": null,
        "dangerous_goods_id": "3454283e-f921-4f6a-9546-39bb52a067cc",
        "determinants": false,
        "dockage": false,
        "entry_bow_draught": 9.8,
        "entry_stern_draught": 10.7,
        "eta": "2023-06-14T15:00:00",
        "exit_bow_draught": null,
        "exit_stern_draught": null,
        "expected_operations": null,
        "handicap_info": null,
        "human_lives_at_risk": false,
        "imdg_2_cargo": false,
        "imdg_7_cargo": false,
        "iva_exemption_requested": false,
        "manual_document_number": null,
        "maximum_draught": 15.5,
        "nav_aids_determinants": false,
        "nav_aids_determinants_desc": null,
        "num_crew_members": 27,
        "num_days_next_call": 9,
        "num_passengers": 1,
        "other_ballast_types": null,
        "port_of_call_code": null,
        "port_of_call_desc": null,
        "port_of_call_id": "704d8c52-24bb-48f2-92b9-10accf987b6a",
        "previous_customs_ship_id": null,
        "previous_route": null,
        "ramp": false,
        "ramp_type_desc": null,
        "ramp_type_id": null,
        "regular_line_id": "f45bd569-563a-4ca0-ba47-c110f8d28092",
        "regular_line_level_desc": null,
        "regular_line_level_id": null,
        "schedueled_work": null,
        "ship_hull_configuration_desc": null,
        "ship_hull_configuration_id": null,
        "sick_injured_dead": false,
        "spoils": false,
        "stability_determinants": false,
        "stability_determinants_desc": null,
        "stoaway_number": null,
        "stoaways": false,
        "subject_to_inspection": false,
        "total_persons_on_board": null,
        "transit_class_1_quantity": null,
        "transit_class_51_quantity": null,
        "tug_boat": false,
        "tug_name": null,
        "tug_power": null,
        "unload_class_1_quantity": null,
        "unload_class_51_quantity": null,
        "volume_and_nature_of_cargo": null,
        "zone_code": null,
        "zone_desc": null,
        "zone_id": null,
        "vessel_call_id": "d621929a-e0ae-49c6-8dae-dd35d3abfa6c",
        "report_id": "f04f12a4-052e-4a2b-982b-4d2873aa5cbb",
        "status_id": "5339cb73-c258-4958-92b1-e3ef8666fe19",
        "creation_substitute_type": null,
        "version_substitute_type": null,
        "prov": "JNA1325"
      }
    },
    "JM2152": {
      "table": "E_julcm_manifest",
      "dados": {
        "id": "96235003-7960-4c55-87b9-11a308df8d70",
        "creation_date": "2023-06-12T12:58:19.803000",
        "version_date": "2023-07-12T13:58:41.697000",
        "version_number": 73,
        "business_entity_id": "c675b807-6a70-4e06-8973-66084fe8b3ad",
        "classified": null,
        "closed": null,
        "declarant_id": "c675b807-6a70-4e06-8973-66084fe8b3ad",
        "justification": null,
        "number": "PTSIEMAN23001772",
        "observations": null,
        "status_id": "26c0d99e-adaf-4366-ba10-6462228ee036",
        "entity_freighter_id": "ea29193f-e641-4fc6-8056-4cc168279e4e",
        "entity_shipping_line_id": "ea29193f-e641-4fc6-8056-4cc168279e4e",
        "function": "9",
        "manifest_date": "2023-06-12T12:50:00",
        "manifest_number": "23007183",
        "manifest_type_id": "15bed62c-860a-44db-a622-87ce26236f46",
        "message_type": "EDIFACT",
        "provisory": false,
        "send_status": "dc44d88f-2c8a-4b4c-afd6-a328635d24c8",
        "travel_number": null,
        "vessel_call_id": "d621929a-e0ae-49c6-8dae-dd35d3abfa6c",
        "cargo_management_gen_data_id": "75ab8667-040c-4847-b834-38f32340f811",
        "finalized": true,
        "creation_substitute_type": null,
        "version_substitute_type": null,
        "prov": "JM2152"
      }
    },
    "JTD537189": {
      "table": "E_julcm_transport_document",
      "dados": {
        "id": "ce07101d-7deb-4580-a2a8-30668e79f611",
        "creation_date": "2023-06-13T09:39:19.517000",
        "version_date": "2023-06-13T09:49:41.877000",
        "version_number": 4,
        "business_entity_id": "c675b807-6a70-4e06-8973-66084fe8b3ad",
        "classified": null,
        "closed": null,
        "declarant_id": "c675b807-6a70-4e06-8973-66084fe8b3ad",
        "justification": "Adição de Documento a esta Contramarca",
        "number": "PTSIEDOC23260235",
        "observations": null,
        "status_id": "dc44d88f-2c8a-4b4c-afd6-a328635d24c8",
        "date_transport_document": "2023-06-07T08:10:00",
        "declaration_date": null,
        "declaration_status": "Provisório",
        "document_transport_type_id": "96ecdc87-4414-4f3d-9691-7a4ecd5ceb48",
        "general_information": null,
        "item_order": 883,
        "loading_locode_id": "PTSIE",
        "message_type": "EDIFACT",
        "mode_transport_id": "df379e57-f584-4fc1-b911-8b27ca0aaad5",
        "place_delivery_country_id": null,
        "place_delivery_description": null,
        "place_delivery_locode_id": "e510c222-a1e4-4807-89ef-3b4bc0f11171",
        "place_emission_country_id": null,
        "place_emission_description": null,
        "place_emission_locode_id": "6afbdbc0-a3da-4434-9977-5a150864940a",
        "place_reception_country_id": null,
        "place_reception_description": null,
        "place_reception_locode_id": "61c47a13-2f1d-4fe6-aaa7-2822e4e7d3d2",
        "reference": "MEDUD8249374",
        "remarks": null,
        "removed": 0,
        "send_status": "dc44d88f-2c8a-4b4c-afd6-a328635d24c8",
        "single_transport_contract": 0,
        "summary_declaration_date": "2023-06-13T09:49:00",
        "summary_declaration_number": "PTSIE670120230008180994",
        "transport_step_id": "faa5cbb2-f3a9-424b-aaaa-a81840d0c1f3",
        "unloading_locode_id": "CLSAI",
        "vessel_call_id": "d621929a-e0ae-49c6-8dae-dd35d3abfa6c",
        "manifest_id": "96235003-7960-4c55-87b9-11a308df8d70",
        "original_transport_doc_id": null,
        "creation_substitute_type": null,
        "version_substitute_type": null,
        "prov": "JTD537189"
      }
    },
    "JTDE384486": {
      "table": "E_julcm_transport_document_equipment",
      "dados": {
        "id": "aa3859e6-4171-4ad1-8e46-9f3164a6bce1",
        "creation_date": "2023-06-13T09:39:19.663000",
        "version_date": "2023-06-13T09:39:19.663000",
        "version_number": 1,
        "equipment_transport_id": null,
        "goods_equipment_type_id": "5bb84bc0-d1de-4559-93e6-a6427face02e",
        "plate": "FCIU4465304",
        "situation_transport_equip_id": "2d975876-57a5-4e96-a0a9-aa133bb88c98",
        "tare": 2200,
        "transport_document_id": "ce07101d-7deb-4580-a2a8-30668e79f611",
        "iso_dimension_id": null,
        "iso_type_id": "0db90060-de28-4b69-927a-83b30f9e51c1",
        "codification_type_id": "9e6dfa8a-c12b-4983-b60e-854789f103e8",
        "size": null,
        "creation_substitute_type": null,
        "version_substitute_type": null,
        "prov": "JTDE384486"
      }
    },
    "JCT8055": {
      "table": "E_julmd_container_type",
      "dados": {
        "id": "0db90060-de28-4b69-927a-83b30f9e51c1",
        "creation_date": "2020-10-17T22:50:51.917000",
        "version_date": "2020-10-17T22:50:51.917000",
        "version_number": 1,
        "code": "22G1",
        "description": "Contentor Para Uso Geral Não Ventilado",
        "enabled": true,
        "height": 8,
        "length": 20,
        "payload": null,
        "reefer_container": null,
        "width": 8,
        "agency_id": "9e6dfa8a-c12b-4983-b60e-854789f103e8",
        "iso_size_id": "6d2ea066-9051-546c-6b2c-f76615e6e0d1",
        "tariff_size_id": null,
        "creation_substitute_type": null,
        "version_substitute_type": null,
        "prov": "JCT8055"
      }
    },
    "JTE801800": {
      "table": "E_julmd_transport_equipment",
      "dados": {
        "id": "96c6f6df-049a-4db3-9500-f725f95e5fba",
        "creation_date": "2020-10-18T23:59:30.493000",
        "version_date": "2020-10-18T23:59:30",
        "version_number": 1,
        "enabled": true,
        "observations": null,
        "plate_number": "FCIU4465304",
        "swap_body": false,
        "tare": 2200,
        "verified": true,
        "agency_id": null,
        "container_type_id": "0db90060-de28-4b69-927a-83b30f9e51c1",
        "tare_measure_unit_id": null,
        "transport_equipment_type_id": "5bb84bc0-d1de-4559-93e6-a6427face02e",
        "prov": "JTE801800"
      }
    },
    "JML2": {
      "table": "jul_md_lov",
      "dados": {
        "id": "2d975876-57a5-4e96-a0a9-aa133bb88c98",
        "code": 5,
        "description": "Cheio",
        "enabled": 1,
        "lov_type_id": "a3bc81f4-8dd3-4c42-ba32-7fc5c7b3b91b",
        "column6": null,
        "column7": null,
        "column8": null,
        "column9": null,
        "prov": "JML2"
      }
    },
    "JGD554398": {
      "table": "E_julcm_goods_detail",
      "dados": {
        "id": "ca07a9d4-2bcf-4200-b80c-8f9095084251",
        "creation_date": "2023-06-13T09:39:20.653000",
        "version_date": "2023-06-13T09:49:41.880000",
        "version_number": 4,
        "business_entity_id": "c675b807-6a70-4e06-8973-66084fe8b3ad",
        "classified": null,
        "closed": null,
        "declarant_id": "c675b807-6a70-4e06-8973-66084fe8b3ad",
        "justification": null,
        "number": "PTSIEPTT23508852",
        "observations": null,
        "status_id": "dc44d88f-2c8a-4b4c-afd6-a328635d24c8",
        "currency_id": null,
        "data_goods_id": null,
        "declaration_date": null,
        "declaration_status": null,
        "desc_operation_location": null,
        "destination_locode": "f538a5fb-e5df-487d-8667-2a24fbb9b773",
        "empty_container_goods": false,
        "empty_equipment_tare": null,
        "general_information": null,
        "goods_azores_madeira": false,
        "goods_vehicle": false,
        "harmonized_goods_id": "80103012-2c38-4748-b990-8dc2412f21db",
        "item_order": 1,
        "loading_locode_id": "742c1faf-bcf8-4155-a372-f8a53e9669b2",
        "nature_cargo_id": "af99a70d-51ba-4419-8b98-5b582bb872fb",
        "number_packages": 20,
        "operation_location_id": "88228a84-65b0-4482-b9d3-70b39d4cd266",
        "packaging_code": null,
        "packing_type_id": "a0e64767-f4be-449f-8fea-e65441ac23c9",
        "removed": false,
        "summary_declaration_date": "2023-06-13T09:49:00",
        "summary_declaration_number": "PTSIE67012023000818099401",
        "type_export_declaration_id": "c7216418-a5bd-4e7c-81f9-3393a35a2969",
        "value": null,
        "value_type": null,
        "volume": null,
        "weight": 17860.0,
        "vessel_call_id": "d621929a-e0ae-49c6-8dae-dd35d3abfa6c",
        "transport_document_id": "ce07101d-7deb-4580-a2a8-30668e79f611",
        "creation_substitute_type": null,
        "version_substitute_type": null,
        "prov": "JGD554398"
      }
    },
    "JGDS1428440": {
      "table": "E_julcm_goods_detail_split",
      "dados": {
        "id": "07906fe9-7780-4abc-89d7-d1397ba4645b",
        "creation_date": "2023-06-13T09:39:20.917000",
        "version_date": "2023-06-13T09:39:20.917000",
        "version_number": 1,
        "quantity": 20.0,
        "volume_m_3": null,
        "weight": 17860.0,
        "goods_detail_id": "ca07a9d4-2bcf-4200-b80c-8f9095084251",
        "transport_doc_equipment_id": "aa3859e6-4171-4ad1-8e46-9f3164a6bce1",
        "prov": "JGDS1428440"
      }
    },
    "JHG7941": {
      "table": "E_julmd_harmonized_goods",
      "dados": {
        "id": "80103012-2c38-4748-b990-8dc2412f21db",
        "creation_date": "2020-01-10T22:53:17.450000",
        "version_date": "2020-01-10T22:53:17.450000",
        "version_number": 1,
        "code": "29053200",
        "description": "Propilenoglicol (propan-1,2-diol)",
        "enabled": true,
        "desc_en": null,
        "end_valid_date": null,
        "start_valid_date": null,
        "creation_substitute_type": null,
        "version_substitute_type": null,
        "prov": "JHG7941"
      }
    },
    "HC21701": {
      "table": "HC_NST2007",
      "dados": {
        "CN2007_8P": "29053200",
        "CN2007_8P_Label_EN": "Propylene glycol \"propane-1,2-diol\"",
        "CN2007_8P_Label_PT": "Propilenoglicol [propan-1,2-diol]",
        "NST2007_3P": "047",
        "NST2007_3P_Label_EN": "Basic organic chemical products",
        "CN2007_3P_Label_PT": "Produtos químicos orgânicos de base",
        "NST2007_2P": "08",
        "NST2007_2P_Label_EN": "Chemicals, chemical products, and man-made fibres; rubber and plastic products; nuclear fuel",
        "CN2007_2P_Label_PT": "Produtos químicos e fibras sintéticas; artigos de borracha e de matérias plásticas; combustível nuclear ",
        "prov": "HC21701"
      }
    }
  }
  };

  useEffect(() => {
    // Initialize network with mock data
    const network = new Network(containerRef.current, {
      nodes: mockData.nodes,
      edges: mockData.edges,
    }, {
      layout: { hierarchical: false },
      physics: { stabilization: true },
      interaction: { hover: true },
    });

    // Set up the click event
    network.on("click", (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const info = mockData.modal_info?.[nodeId];
        if (info) setModalData(info);
      }
    });
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ height: "600px", width: "100%" }} />
      {modalData && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Informação da Tabela {modalData.table}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setModalData(null)}
                ></button>
              </div>
              <div className="modal-body" style={{ maxHeight: 400, overflowY: "auto" }}>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Procurar atributo..."
                  onInput={(e) => {
                    const query = e.target.value.toLowerCase();
                    document.querySelectorAll(".modal-body tr").forEach((row) => {
                      row.style.display = row.children[0].textContent.toLowerCase().includes(query)
                        ? ""
                        : "none";
                    });
                  }}
                />
                <table className="table">
                  <tbody>
                    {Object.entries(modalData.dados || {}).map(([key, value]) => (
                      <tr key={key}>
                        <td><strong>{key}</strong></td>
                        <td>{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => setModalData(null)}
                >
                  <i className="bi bi-x-lg"></i> Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GrafoViewer;