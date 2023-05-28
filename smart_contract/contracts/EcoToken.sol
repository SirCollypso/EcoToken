// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EcoToken {

    uint256 public baseValueEth;
    uint256 public baseValueEcoToken;
    uint256 public rewardRate;

    struct Client {
        uint256 ecoTokenBalance;
        bool isBusiness;
        int256 rating;
    }

    struct Event {
        uint256 id;
        string description;
        uint256 reward;
        address organizer;
        int256 rating;
    }

    mapping(address => Client) clients;
    mapping(address => mapping(uint256 => bool)) participated; 
    mapping(address => mapping(uint256 => int8)) eventVotes;

    Event[] events;
    mapping(address => uint256[]) createdEvents;
    mapping(address => uint256[]) participatedEvents; 

    modifier onlyBusinessClient() {
        require(clients[msg.sender].isBusiness, "Only business clients can call this function");
        _;
    }

    modifier onlyNonBusinessClient() {
        require(!clients[msg.sender].isBusiness, "Only non-business clients can call this function");
        _;
    }

    constructor(uint256 _baseValueEth, uint256 _baseValueEcoToken, uint256 _rewardRate) {
        baseValueEth = _baseValueEth;
        baseValueEcoToken = _baseValueEcoToken;
        rewardRate = _rewardRate;
    }

    function registerAsBusiness() external payable onlyNonBusinessClient {
        require(msg.value >= baseValueEth, "Insufficient Ether sent for registration");
        
        Client storage client = clients[msg.sender];

        client.ecoTokenBalance = baseValueEcoToken;
        client.isBusiness = true;
        client.rating = 0;
    }

    function createEvent(string memory _description, uint256 _reward) external onlyBusinessClient {
        Event memory newEvent = Event({
            id: events.length,
            description: _description,
            reward: _reward,
            organizer: msg.sender,
            rating: 0
        });
        events.push(newEvent);
        createdEvents[msg.sender].push(newEvent.id);
    }

    function markParticipant(address _participant, uint256 _eventId) external onlyBusinessClient {
        Event storage eventItem = events[_eventId];
        require(eventItem.organizer == msg.sender, "Only the event organizer can mark participants");
        require(clients[eventItem.organizer].ecoTokenBalance >= eventItem.reward, "Insufficient EcoTokens");

        participated[_participant][_eventId] = true;
        participatedEvents[_participant].push(_eventId);

        clients[_participant].ecoTokenBalance += eventItem.reward;
        clients[eventItem.organizer].ecoTokenBalance -= eventItem.reward;
    }

    function voteForEvent(uint256 _eventId, int8 _vote) external onlyNonBusinessClient {
        require(_vote == -1 || _vote == 1, "Invalid vote value");
        require(participated[msg.sender][_eventId], "You must participate in the event before voting");
        require(eventVotes[msg.sender][_eventId] == 0, "You can only vote once for an event");

        Event storage eventItem = events[_eventId];
        eventItem.rating += _vote;
        clients[eventItem.organizer].rating += _vote;
        eventVotes[msg.sender][_eventId] = _vote;
    }

    function transferEcotokens(address _to, uint256 _amount) external onlyNonBusinessClient {
        require(clients[_to].isBusiness, "You can only transfer EcoTokens to a business client");
        require(clients[msg.sender].ecoTokenBalance >= _amount, "Insufficient EcoTokens");

        uint256 bonusEcotokens = 0;

        if (clients[_to].rating > 0) {
            bonusEcotokens = uint256(clients[_to].rating) / rewardRate;
        }
        
        clients[msg.sender].ecoTokenBalance = clients[msg.sender].ecoTokenBalance - _amount;
        clients[_to].ecoTokenBalance = clients[_to].ecoTokenBalance + _amount + bonusEcotokens;
    }

    function getClientBalance() external view returns (uint256) {
        return clients[msg.sender].ecoTokenBalance;
    }

    function getBusinessStatus() external view returns (bool) {
        return clients[msg.sender].isBusiness;
    }
    
    function getVoteStatus(uint256 _eventId) external view onlyNonBusinessClient() returns (int8) {
        require(participated[msg.sender][_eventId], "You have not participated in the event");
        return eventVotes[msg.sender][_eventId];
    }

    function getEventCount() external view returns (uint256) {
        return events.length;
    }

    function getEvent(uint256 _eventId) external view returns (uint256, string memory, uint256, address, int256) {
        require(_eventId < events.length, "Event does not exist");

        Event storage eventItem = events[_eventId];
        return (eventItem.id, eventItem.description, eventItem.reward, eventItem.organizer, eventItem.rating);
    }

    function getEvents() external view returns (Event[] memory) {
        return events;
    }

    function getCreatedEventCount() external view onlyBusinessClient returns (uint256) {
        return createdEvents[msg.sender].length;
    }

    function getCreatedEvent(uint256 _eventIndex) external view onlyBusinessClient returns (uint256, string memory, uint256, address, int256) {
        require(_eventIndex < createdEvents[msg.sender].length, "Event does not exist");

        Event storage eventItem = events[createdEvents[msg.sender][_eventIndex]];
        return (eventItem.id, eventItem.description, eventItem.reward, eventItem.organizer, eventItem.rating);
    }

    function getCreatedEvents() external view onlyBusinessClient() returns (Event[] memory) {
        Event[] memory _createdEvents = new Event[](createdEvents[msg.sender].length);

        for (uint i = 0; i < createdEvents[msg.sender].length; i++) {
            _createdEvents[i] = events[createdEvents[msg.sender][i]];
        }

        return _createdEvents;
    }

    function getParticipatedEventCount() external view onlyNonBusinessClient returns (uint256) {
        return participatedEvents[msg.sender].length;
    }

    function getParticipatedEvent(uint256 _eventIndex) external view onlyNonBusinessClient returns (uint256, string memory, uint256, address, int256) {
        require(_eventIndex < participatedEvents[msg.sender].length, "Event does not exist");

        Event storage eventItem = events[participatedEvents[msg.sender][_eventIndex]];
        return (eventItem.id, eventItem.description, eventItem.reward, eventItem.organizer, eventItem.rating);
    }

    function getParticipatedEvents() external view onlyNonBusinessClient() returns (Event[] memory) {
        Event[] memory _participatedEvents = new Event[](participatedEvents[msg.sender].length);

        for (uint i = 0; i < participatedEvents[msg.sender].length; i++) {
            _participatedEvents[i] = events[participatedEvents[msg.sender][i]];
        }

        return _participatedEvents;
    }
}
