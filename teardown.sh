#!/bin/bash

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Credit Jambo Admin - Teardown${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

stop_service() {
    print_info "Stopping admin frontend..."
    docker-compose down
    print_success "Admin frontend stopped"
}

remove_image() {
    if [ "$1" == "--image" ]; then
        print_info "Removing Docker image..."
        docker-compose down --rmi all
        print_success "Image removed"
    fi
}

main() {
    print_header
    
    if [ "$1" == "--all" ]; then
        print_info "Performing complete cleanup..."
        docker-compose down --rmi all
        print_success "Complete cleanup done"
    else
        stop_service
        remove_image "$1"
    fi
    
    echo ""
    print_success "Teardown completed"
    echo ""
    echo "Options:"
    echo "  ./teardown.sh           Stop service only"
    echo "  ./teardown.sh --image   Stop and remove Docker image"
    echo "  ./teardown.sh --all     Complete cleanup"
    echo ""
}

main "$@"
