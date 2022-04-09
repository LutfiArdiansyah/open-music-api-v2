const Response = require("../../utils/Response");

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;

    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyNotOwner(playlistId, credentialId);

    return Response.post(h, "success", "Kolaborasi berhasil ditambahkan", {
      collaborationId: await this._collaborationsService.addCollaboration(
        playlistId,
        userId
      ),
    });
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;

    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyNotOwner(playlistId, credentialId);

    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return Response.putOrDelete("success", "Kolaborasi berhasil dihapus");
  }
}

module.exports = CollaborationsHandler;
