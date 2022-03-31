aca-py start \
    -it acapy_plugin_toolbox.http_ws 0.0.0.0 "$PORT" \
    -ot http \
    -e "$ACAPY_ENDPOINT" \
    --label "$AGENT_NAME" \
    --auto-accept-requests --auto-ping-connection \
    --auto-respond-credential-proposal --auto-respond-credential-offer --auto-respond-credential-request --auto-store-credential \
    --auto-respond-presentation-proposal --auto-respond-presentation-request --auto-verify-presentation \
    --invite --invite-role admin --invite-label "$AGENT_NAME (admin)" \
    --genesis-url https://raw.githubusercontent.com/Indicio-tech/indicio-network/master/genesis_files/pool_transactions_testnet_genesis \
    --wallet-type indy \
    --plugin acapy_plugin_toolbox \
    --plugin acapy_plugin_data_transfer \
    --admin 0.0.0.0 "$ADMIN_PORT" --admin-insecure-mode \
    --webhook-url "$WEBHOOK_ADDRESS" \
    --debug-connections \
    --debug-credentials \
    --debug-presentations \
    --enable-undelivered-queue \
#    --log-level debug \
    "$@"
