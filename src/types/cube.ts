// Cube mode types — collaborative cube management

export interface Cube {
  id: string
  name: string
  owner_name: string
  vote_threshold: 'majority' | 'unanimous'
  target_size: number
  created_at: string
  updated_at: string
}

export interface CubeMember {
  id: string
  cube_id: string
  name: string
  color: string
  joined_at: string
}

export interface CubeCard {
  id: string
  cube_id: string
  scryfall_id: string
  name: string
  mana_cost: string
  cmc: number
  type_line: string
  color_identity: string[]
  tags: string[]
  set_code: string
  image_uri: string
  added_by: string
  added_at: string
}

export interface Proposal {
  id: string
  cube_id: string
  type: 'cut' | 'add' | 'swap'
  cut_card_id?: string
  add_scryfall_id?: string
  add_card_name?: string
  add_card_data?: Record<string, unknown>
  reason: string
  proposed_by: string
  status: 'pending' | 'approved' | 'rejected'
  resolved_at?: string
  created_at: string
}

export interface Vote {
  id: string
  proposal_id: string
  voter_name: string
  vote: 'approve' | 'reject'
  created_at: string
}

export interface ChangeHistoryEntry {
  id: string
  cube_id: string
  proposal_id?: string
  action: 'added' | 'cut' | 'swapped'
  card_name: string
  swap_card_name?: string
  proposed_by: string
  approved_by: string[]
  applied_at: string
}
