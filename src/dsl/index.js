const aRoom = (id, name, synonyms, description) =>
  ({ id, name, synonyms, description });
const anItem = (id, name, synonyms, description, location, pickable, pickingResponse) =>
  ({ id, name, synonyms, description, location, pickable, pickingResponse });
const anUsage = (items, response, onlyOnce) =>
  ({ items, response, onlyOnce });
const anUnlockingAction = (response, lock) => ({ isUnlockingAction: true, response, lock });
const aPickingAction = (response, itemId) => ({ isPickingAction: true, response, itemId });
const anExpectAnswerAction = (response, question) =>
  ({ isExpectingAnswerAction: true, response, question });
const aConditionalResponse = conditions => ({ isConditional: true, conditions });
const aLockedDestination = (roomId, lockCondition, sentence = null) =>
  ({ isLockedDestination: true, roomId, lockCondition, sentence });
const aCondDesc = (condition, description) => ({ conditional: true, condition, description });
const aCondDescUsage = (consumesObjects, condition, description) =>
  ({ conditional: true, consumesObjects, condition, description });
const theEndingScene = description => ({ isEndingScene: true, description });
const anAnswer = (question, answer, response, sentenceWhenWrong) =>
  ({ question, answer, response, sentenceWhenWrong });
const aPickingCondition = (condition, response) =>
  ({ isPickingCondition: true, condition, response });
const pluginExtension = (...data) => ({ isPluginExtension: true, data });
const aCommandSyn = (fromCommand, arg, toCommand) => ({ fromCommand, arg, toCommand });
const Commands = { WALK: 'walk', USE: 'use', PICKUP: 'pickup', LOOK: 'look' };

exports.aRoom = aRoom;
exports.anItem = anItem;
exports.anUsage = anUsage;
exports.anUnlockingAction = anUnlockingAction;
exports.anExpectAnswerAction = anExpectAnswerAction;
exports.aConditionalResponse = aConditionalResponse;
exports.aLockedDestination = aLockedDestination;
exports.aCondDesc = aCondDesc;
exports.aCondDescUsage = aCondDescUsage;
exports.theEndingScene = theEndingScene;
exports.anAnswer = anAnswer;
exports.pluginExtension = pluginExtension;
exports.aPickingAction = aPickingAction;
exports.aPickingCondition = aPickingCondition;
exports.aCommandSyn = aCommandSyn;
exports.Commands = Commands;
