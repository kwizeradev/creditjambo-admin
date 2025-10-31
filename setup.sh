#!/bin/bash

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Credit Jambo Admin - Docker Setup${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker Desktop."
        exit 1
    fi
    
    print_success "Docker is installed and running"
}

check_docker_compose() {
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed."
        exit 1
    fi
    print_success "Docker Compose is available"
}

check_backend() {
    print_info "Checking if backend is running..."
    if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
        print_success "Backend is running at http://localhost:4000"
    else
        print_error "Backend is not running at http://localhost:4000"
        echo ""
        echo "Please start the backend first:"
        echo "  cd ../creditjambo-client"
        echo "  ./setup.sh"
        echo ""
        exit 1
    fi
}

setup_env_file() {
    if [ ! -f .env ]; then
        print_info "Creating .env file from .env.docker..."
        cp .env.docker .env
        print_success ".env file created"
    else
        print_info ".env file already exists"
    fi
}

build_services() {
    print_info "Building Docker image..."
    docker-compose build --no-cache
    print_success "Docker image built successfully"
}

start_services() {
    print_info "Starting admin frontend..."
    docker-compose up -d
    print_success "Admin frontend started"
}

wait_for_service() {
    print_info "Waiting for admin frontend to be ready..."
    
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s http://localhost:5174 > /dev/null 2>&1; then
            print_success "Admin frontend is ready"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    
    print_error "Admin frontend did not become ready in time"
    return 1
}

show_status() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Service Status${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    docker-compose ps
}

show_credentials() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Access Information${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo ""
    echo -e "${GREEN}Admin Dashboard:${NC}  http://localhost:5174"
    echo -e "${GREEN}Backend API:${NC}      http://localhost:4000"
    echo ""
    echo -e "${YELLOW}Admin Credentials:${NC}"
    echo -e "  Email:    admin@creditjambo.com"
    echo -e "  Password: Admin123!"
    echo ""
}

show_next_steps() {
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Next Steps${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo ""
    echo "1. Open http://localhost:5174 in your browser"
    echo "2. Login with admin credentials above"
    echo "3. Verify customer devices and manage accounts"
    echo ""
    echo "Useful commands:"
    echo "  docker-compose logs -f          View logs"
    echo "  docker-compose down             Stop service"
    echo "  docker-compose restart          Restart service"
    echo "  docker-compose ps               Check status"
    echo ""
}

main() {
    print_header
    
    check_docker
    check_docker_compose
    check_backend
    
    echo ""
    setup_env_file
    
    echo ""
    build_services
    
    echo ""
    start_services
    
    echo ""
    wait_for_service
    
    show_status
    show_credentials
    show_next_steps
    
    print_success "Setup completed successfully!"
}

main
