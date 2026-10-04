Actions that modify state directly (need unactions):                                                                      

  Turn/Step:                                                                                                                
  V EFFECT_TYPE_START_OF_TURN - calls clearAttackMarkers(), clearActionsUsed() on creatures/relics/magi                     

  Discard/Shuffle:                                                                                                          
  V EFFECT_TYPE_RESHUFFLE_DISCARD - modifies deck.add(), deck.shuffle(), discard.empty()                                    

  Attack:                                                                                                                   
  V EFFECT_TYPE_BEFORE_DAMAGE - calls markAttackDone(), markAttackReceived()                                                
  V EFFECT_TYPE_CREATURE_DEFEATS_CREATURE - calls markDefeatedCreature()                                                    

  Energy:                                                                                                                   
  V EFFECT_TYPE_MOVE_ENERGY - directly calls removeEnergy(), addEnergy()                                                    
  V EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE - directly calls removeEnergy()                                                 
  V EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI - directly calls removeEnergy()                                                     
  V EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES - directly calls setEnergy()                                                  
  V EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES - directly calls addEnergy()                                                 

  Cards/Attachments:                                                                                                        
  - EFFECT_TYPE_ATTACH_CARD_TO_CARD - calls this.attachCard()                                                               

  Triggers:                                                                                                                 
  V EFFECT_TYPE_ADD_DELAYED_TRIGGER - modifies this.state.delayedTriggers                                                   
  V EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE - calls target.forbidAttacks()                                                    

  Powers:                                                                                                                   
  - EFFECT_TYPE_EXECUTE_POWER_EFFECTS - calls source.setActionUsed()                                                        

  Prompts:                                                                                                                  
  V EFFECT_TYPE_PROMPT_ENTERED - modifies this.state.prompt and related fields                                              

  Metadata:                                                                                                                 
  V EFFECT_TYPE_FIND_STARTING_CARDS - sets spellMetaDataField('foundCards')                                                 

  ---                                                                                                                       
  Total: 16 actions that directly modify state and need unactions.